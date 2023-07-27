import { Header } from '@/components'
import React from 'react'
import PlanCard from './components/PlanCard'
import { getCurrentUser, getUserSubscriptionPlan } from '@/actions'

const PricingPage = async () => {

    const user = await getCurrentUser();

    return (
        <div className='w-full flex-1'>
            <div className='flex flex-col'>
                <div className='flex-col p-8 pt-6'>
                    <Header title='Pricing' subtitle='Manage billing and your subscription plan' />
                </div>
            </div>
            <div className='p-8'>
                <PlanCard user={user} />
            </div>
        </div>
    )
}

export default PricingPage
