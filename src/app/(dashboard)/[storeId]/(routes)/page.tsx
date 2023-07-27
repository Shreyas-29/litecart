import { getGraphRevenue, getOrdersCount, getRevenue, getSaleCount, getStockCount } from '@/actions';
import { Header, Overview } from '@/components';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Tabs, TabsContent } from '@/components/ui/Tabs';
import { Activity, Box, CreditCard, DollarSign, IndianRupee, Package, PackageCheck, Users } from 'lucide-react';


export default async function Dashboard({
    params
}: {
    params: { storeId: string }
}) {

    const storeId = params.storeId;

    const totalRevenue = await getRevenue(storeId);
    const salesCount = await getSaleCount(storeId);
    const stockCount = await getStockCount(storeId);
    const graphRevenue = await getGraphRevenue(storeId);
    const ordersCount = await getOrdersCount(storeId);


    return (
        <div className='mx-auto'>
            <div className="hidden flex-col md:flex">
                <div className="flex-1 space-y-4 p-8 pt-6">
                    <Header title='Overview' subtitle='Manage your products and orders' />
                    <Tabs defaultValue="overview" className="space-y-4">
                        <hr className='bg-zinc-300 w-full h-px my-1' />
                        <TabsContent value="overview" className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            Total Revenue
                                        </CardTitle>
                                        <IndianRupee className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent className='px-6 pb-4'>
                                        <div className="text-2xl font-bold">
                                            ₹{totalRevenue}
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            Sales
                                        </CardTitle>
                                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent className='px-6 pb-4'>
                                        <div className="text-2xl font-bold">
                                            {salesCount}
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            Products
                                        </CardTitle>
                                        <Box className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent className='px-6 pb-4'>
                                        <div className="text-2xl font-bold">
                                            {stockCount}
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">
                                            Orders
                                        </CardTitle>
                                        <PackageCheck className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent className='px-6 pb-4'>
                                        <div className="text-2xl font-bold">
                                            {ordersCount}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                            <div className="grid md:grid-cols-2">
                                <Card className="col-span-4">
                                    <CardHeader>
                                        <CardTitle>
                                            Analytics
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pl-2">
                                        <Overview data={graphRevenue} />
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
