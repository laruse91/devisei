import React, { memo, useEffect, useState } from 'react'
import { Section } from '../../components/common/Section'
import { ProductCard } from '../../components/cards/ProductCard'
import { getGoods } from '../../store/shop-reducer'
import { useDispatch, useSelector } from 'react-redux'
import { select } from '../../selectors/selectors'
import { Affix, Col, Collapse, Divider, Dropdown, Grid, Input, Menu, Pagination, Row, Typography } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { DownOutlined } from '@ant-design/icons'
import { MenuInfo } from 'rc-menu/lib/interface'
import { PriceFilter } from './PriceFilter'
import { Categories } from './Categories'
import { CheckList } from './CheckList'
import { CheckboxValueType } from 'antd/es/checkbox/Group'
import * as queryString from 'querystring'
import { TQueryParams } from '../../types/types'
import { CardSkeleton } from '../../components/cards/CardSkeleton'
import { fillArray } from '../../utils/helpers'
import { BreadCrumbs } from '../../components/common/BreadCrumbs'
import { getCategories } from '../../store/app-reducer'

const { Panel } = Collapse
const { Search } = Input
const { Title } = Typography
const { useBreakpoint } = Grid

export const Shop: React.FC = memo(() => {
    const [category, setCategory] = useState<string | undefined>(undefined)
    const [brands, setBrands] = useState<string[]>([])
    const [sort, setSort] = useState<'desc' | 'asc'>('asc')
    const [price, setPrice] = useState<[number, number] | undefined>(undefined)
    const [page, setPage] = useState(1)

    const goods = useSelector(select.goods)
    const categories = useSelector(select.categories)
    const dispatch = useDispatch()

    const params: { category: string } = useParams()
    const history = useHistory()
    const screen = useBreakpoint()

    const parseQuery = (): void => {
        const parsed = queryString.parse(history.location.search.substr(1)) as TQueryParams

        if (parsed.page) setPage(Number(parsed.page))
        if (parsed.brand) setBrands(parsed.brand.split('_'))
        if (parsed.priceFrom) setPrice([Number(parsed.priceFrom), Number(parsed.priceTo)])
    }

    useEffect(() => {
        parseQuery()
        if (params.category) setCategory(params.category)
        if (!categories) dispatch(getCategories())
        dispatch(getGoods(category, price, brands, sort, page))
    }, [])
    useEffect(() => {
        dispatch(getGoods(category, price, brands, sort, page))

        const query = {} as TQueryParams
        if (page !== 1) query.page = String(page)
        if (brands.length) query.brand = brands.join('_')
        if (price) {
            query.priceFrom = String(price[0])
            query.priceTo = String(price[1])
        }

        history.push({
            search: queryString.stringify(query),
        })
    }, [brands, price, page, sort])
    useEffect(() => {
        dispatch(getGoods(category, price, brands, sort, page))
        setBrands([])
        if (category) history.replace({ pathname: `/shop/${category}` })
    }, [category])

    const handlePageChange = (page: number) => {
        setPage(page)
    }
    const handleSorting = (key: MenuInfo) => {
        setSort(key.keyPath[0] as 'desc' | 'asc')
    }
    const handleSearch = () => {}
    const handleCategorySelect = (value: string) => {
        setCategory(value)
    }
    const handlePriceFilter = (values: [number, number]) => {
        setPrice(values)
    }
    const handleBrandChecked = (values: CheckboxValueType[]) => {
        setBrands(values as string[])
    }
    const handleLinkClick = () => {
        setCategory(undefined)
    }

    const responsive = { xs: 24, sm: 12, md: 12, lg: 8, xxl: 6 }
    const pageTitle = category ? category[0].toUpperCase() + category.slice(1) : 'Shop'
    const offset = !screen.sm ? -1000 : 150
    const cardType = !screen.sm ? 'horizontal' : 'vertical'

    const goodsCards = !goods
        ? fillArray(12).map((card) => {
              return <CardSkeleton key={card} responsive={responsive} />
          })
        : goods.items.map((g) => {
              return <ProductCard key={g.id} product={g} responsive={responsive} type={cardType} />
          })
    const menu = (
        <Menu onClick={handleSorting}>
            <Menu.Item key='asc'>Price: low to height</Menu.Item>
            <Menu.Item key='desc'>Price: height to low</Menu.Item>
        </Menu>
    )
    const filtration = goods && categories && (
        <Affix offsetTop={offset}>
            <div>
                <Row justify='center'>
                    <Categories current={category} onSelect={handleCategorySelect} categories={categories} />
                </Row>
                <Row style={{ margin: '30px 0' }}>
                    <CheckList checked={brands} options={goods.brands} onChange={handleBrandChecked} />
                </Row>
                <Row justify='center'>
                    <PriceFilter
                        currentRange={price}
                        min={0}
                        max={goods.maximalPrice}
                        onRangeChange={handlePriceFilter}
                    />
                </Row>
            </div>
        </Affix>
    )

    return (
        <>
            <BreadCrumbs routes={['shop', category]} onClick={handleLinkClick} />

            <Section justify='start' bgColor='white'>
                <Title style={{ margin: '0' }}>{pageTitle}</Title>
                <Divider />
            </Section>

            <Section bgColor='white' gutter={[20, 20]} justify='start'>
                <Col xs={24} sm={8} md={8} lg={6} xl={6} xxl={4}>
                    <Search
                        placeholder='input search text'
                        allowClear
                        onSearch={handleSearch}
                        style={{ width: '100%', marginBottom: '30px' }}
                    />

                    {!screen.sm ? (
                        <Collapse style={{ borderRadius: '5px' }}>
                            <Panel header='Filters' key='filter'>
                                {filtration}
                            </Panel>
                        </Collapse>
                    ) : (
                        filtration
                    )}
                </Col>

                <Col xs={24} sm={16} md={16} lg={18} xl={18} xxl={20}>
                    <Row justify='space-between' align='middle' style={{ marginBottom: '20px' }}>
                        <Col xs={4}>
                            <Dropdown overlay={menu} trigger={['click']}>
                                <a className='ant-dropdown-link' onClick={(e) => e.preventDefault()}>
                                    Sort by
                                    <DownOutlined />
                                </a>
                            </Dropdown>
                        </Col>
                        <Pagination
                            defaultCurrent={page}
                            total={goods?.total}
                            defaultPageSize={12}
                            onChange={handlePageChange}
                        />
                        <Col xs={4} />
                    </Row>
                    <Row gutter={[20, 20]}>{goodsCards}</Row>
                </Col>
            </Section>
        </>
    )
})
