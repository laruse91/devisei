import React, { memo, useEffect } from 'react'
import { NewsCard } from '../../components/cards/NewsCard'
import { Space } from 'antd'
import { Section } from '../../components/common/Section'
import { CategoryTabs } from './CategoryTabs'
import { FeatureCard } from '../../components/cards/FeatureCard'
import { PromiseCard } from '../../components/cards/PromiseCard'
import {
    DollarTwoTone,
    HomeTwoTone,
    Loading3QuartersOutlined,
    SafetyCertificateTwoTone,
    ThunderboltTwoTone,
} from '@ant-design/icons'
import { sFont } from '../../styles/styles'
import { useDispatch, useSelector } from 'react-redux'
import { select } from '../../selectors/selectors'
import { Carousell } from './Carousell'
import { getHomeData } from '../../store/home-reducer'
import { ProductCard } from '../../components/cards/ProductCard'

export const Home: React.FC = memo(() => {
    const features = useSelector(select.features)
    const saleGoods = useSelector(select.saleGoods)
    const news = useSelector(select.popularNews)
    const isLoading = useSelector(select.isLoading)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getHomeData())
    }, [])

    const salesResp = { xs: 24, sm: 12, md: 12, lg: 8 }
    const dayDealResp = { xs: 24, sm: 12, md: 16, lg: 18 }

    const featureCards = features?.map((f) => {
        return <FeatureCard key={f.id} product={f} />
    })
    const newsCards = news?.map((n) => {
        return <NewsCard key={n.id} image={n.image} title={n.title} id={n.id} tag={n.tag} date={n.date} />
    })
    const salesCards = saleGoods?.sale.map((g) => {
        return <ProductCard key={g.id} product={g} type='horizontal' responsive={salesResp} />
    })

    if (isLoading)
        return (
            <Section bgColor='white' justify='center' verticalPadding={20}>
                <Loading3QuartersOutlined spin style={sFont(30)} />
            </Section>
        )
    return (
        <>
            <Carousell />

            <Space size={40} direction='vertical'>
                <Section justify='center' verticalPadding={40} gutter={[20, 20]}>
                    <PromiseCard title='Home Shipping' description='Free for all order'>
                        <HomeTwoTone style={sFont(30)} />
                    </PromiseCard>

                    <PromiseCard title='Refund' description='Cash Back'>
                        <DollarTwoTone style={sFont(30)} />
                    </PromiseCard>

                    <PromiseCard title='24h Support' description='Fast Service'>
                        <SafetyCertificateTwoTone style={sFont(30)} />
                    </PromiseCard>

                    <PromiseCard title='Fast Delivery' description='Best Service'>
                        <ThunderboltTwoTone style={sFont(30)} />
                    </PromiseCard>
                </Section>

                <Section bgColor='white' gutter={[20, 20]}>
                    {featureCards}
                </Section>
                <Section bgColor='white' gutter={[20, 20]}>
                    {salesCards}
                </Section>
                <Section bgColor='white' gutter={[20, 0]}>
                    <CategoryTabs />
                </Section>
                <Section title='Deal of days' verticalPadding={20} gutter={[20, 20]}>
                    {saleGoods && (
                        <>
                            <ProductCard
                                responsive={dayDealResp}
                                product={saleGoods.sale[0]}
                                type='horizontal'
                                hover={false}
                                desc
                            />
                            <FeatureCard product={saleGoods.saleOfDay[0]} type='vertical' size={6} />
                        </>
                    )}
                </Section>
            </Space>
            <Section align='top' title='Popular news' bgColor='white' verticalPadding={40} gutter={[20, 20]}>
                {newsCards}
            </Section>
        </>
    )
})
