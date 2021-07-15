import m from 'mithril';
import AppView from './App';
import Icon from '../components/Icon';
import Title from '../components/Title';
import Table from '../components/Table';
import Badge from '../components/Badge';
import MoneyText from '../components/MoneyText';
import Button from '../components/Button';
import Payment from '../components/Payment';

export default class QuoteView {
    constructor(vnode) {
        this.quote_id = vnode.attrs.id;
        console.log('construct QuoteView', this.quote_id);
        this.services = [
            {name: 'Shipping of 3 items (45 kg, 467 mi)', quantity: 1,  price: 105}
        ];
        this.show_payment = false;        
    }

    view(vnode) {
        return (
            <AppView>
                <div class="flex flex-col">
                    <div class='flex justify-between items-end pb-2 border-b border-gray-200'>
                        <div class="flex flex-col">
                            <div class="mb-1 flex items-center text-gray-500">
                                <Icon name="hexagon" class="w-4" />
                                <span class="uppercase ml-2 font-semibold">
                                    Quote
                                </span>
                            </div>
                            <div class="flex items-start">
                                <Title>
                                    <span class="text-gray-400 font-normal">
                                        #
                                    </span>
                                    PN2545
                                </Title>
                            </div>
                        </div>
                    </div>
                    <div class="mt-6 flex justify-between items-start">
                        <div class="flex flex-col">
                            <span class="text-gray-500">
                                From
                            </span>
                            <div class="flex items-center">
                                <span class="text-black font-bold mr-1">
                                    Shipper company
                                </span>
                                <Badge color="gray">
                                    Service provider
                                </Badge>
                            </div>
                            <span class="mt-0.5 text-gray-800">
                                3897 Hickory St, Salt Lake City
                            </span>
                            <span class="text-gray-800">
                                Utah, United States, 84104
                            </span>
                            <span class="text-gray-800">
                                +1 530 761 6256
                            </span>
                        </div>
                        <div class="flex flex-col">
                            <span class="text-gray-500">
                                For
                            </span>
                            <div class="flex items-center">
                                <span class="text-black font-bold mr-1">
                                    Alex Parkinson
                                </span>
                                <Badge color="gray">
                                    Customer
                                </Badge>
                            </div>
                            <span class="mt-0.5 text-gray-800">
                                410 E 8th St, Davis
                            </span>
                            <span class="text-gray-800">
                                California, United States, 95616
                            </span>
                            <span class="text-gray-800">
                                +1 530 761 6256
                            </span>
                        </div>
                    </div>
                    <div class="mt-10 flex flex-col">
                        <Table collection={this.services}
                            fields={[
                                {label: 'item', type: 'string'},
                                {label: 'quantity', type: 'number'},
                                {label: 'price', type: 'number'},
                            ]}>
                            {this.services.map(s => (
                                <tr class="border-b border-gray-200 text-gray-600">
                                    <td class="py-2 italic">
                                        {s.name}
                                    </td>
                                    <td class="py-2 text-right">
                                        <span class="text-sm text-gray-500">
                                            x
                                        </span>
                                        <code class="text-black ml-0.5">
                                            {s.quantity}
                                        </code>
                                    </td>
                                    <td class="py-2 text-right">
                                        <MoneyText currency="usd">
                                            {s.price}
                                        </MoneyText>
                                    </td>
                                </tr>
                            ))}
                        </Table>
                        <div class="flex justify-between">
                            <div class="mt-2 flex flex-col">
                                <div class="flex flex-col">
                                    <span class="text-gray-500">
                                        Pickup date
                                    </span>
                                    <span>
                                        Thursday, July 15
                                    </span>
                                </div>
                                <div class="mt-2 flex flex-col">
                                    <span class="text-gray-500">
                                        Delivery date
                                    </span>
                                    <span>
                                        Friday, July 16
                                    </span>
                                </div>
                            </div>
                            <table>
                                <tr class="border-b border-gray-200">
                                    <td class="py-1 whitespace-nowrap text-gray-700">
                                        Subtotal
                                    </td>
                                    <td class="py-1 pl-6">
                                        <MoneyText currency="usd">
                                            105
                                        </MoneyText>
                                    </td>
                                </tr>
                                <tr class="border-b border-gray-200">
                                    <td class="py-1 whitespace-nowrap text-gray-700">
                                        <div class="flex items-center">
                                            <span class="mr-2">
                                                Platform fees
                                            </span>
                                            <Badge color="gray">
                                                10%
                                            </Badge>
                                        </div>
                                    </td>
                                    <td class="py-1 pl-6">
                                        <MoneyText currency="usd">
                                            14
                                        </MoneyText>
                                    </td>
                                </tr>
                                <tr class="border-b border-gray-200">
                                    <td class="py-1 whitespace-nowrap text-black">
                                        Total
                                    </td>
                                    <td class="py-1 pl-6">
                                        <MoneyText currency="usd">
                                            <span class="text-2xl font-bold">
                                                119
                                            </span>
                                        </MoneyText>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div class="mt-6 flex flex-col">
                        <span class="text-gray-500">
                            Notes from shipper
                        </span>
                        <span class="mt-1 text-gray-800">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam porta arcu sed consequat feugiat. Praesent vel justo suscipit, ultricies eros sed, feugiat orci.
                        </span>
                    </div>
                    {!this.show_payment ? (
                        <div class="mt-6 flex justify-end">
                            <Button icon="arrow-right" callback={() => {
                                this.show_payment = true;
                            }}>
                                Book this shipper
                            </Button>
                        </div>
                    ) : ''}
                    {this.show_payment ? (
                        <div class="mt-6">
                            <Payment close={() => {
                                this.show_payment = false;
                            }} />
                        </div>
                    ) : ''}
                </div>
            </AppView>
        );
    }
}