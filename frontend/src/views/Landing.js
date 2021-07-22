import m from 'mithril';
import Icon from '../components/Icon';
import notepad from '../../assets/notepad.svg';
import clock from '../../assets/clock.svg';
import money from '../../assets/money.svg';

export default class LandingView {
    constructor(vnode) {
        console.log('construct LandingView');
    }

    view(vnode) {
        return (
            <main>
                <div class="flex flex-col items-center">
                    <div class="px-8 w-full md:w-5/6 lg:w-2/3">
                        {/* header */}
                        <div class="flex justify-between items-center p-3 bg-white text-sm">
                            <m.route.Link href="/" options={{ replace: true }} class="flex items-center whi=tespace-nowrap text-xl font-bold">
                                wecompart &trade;
                            </m.route.Link>
                            <div class="flex items-center">
                                <div>
                                    <m.route.Link href="/">
                                        <button class="p-3 text-gray-600 hover:text-gray-800">
                                            Contact
                                        </button>
                                    </m.route.Link>
                                </div>
                                <div>
                                    <m.route.Link href="/auth/login">
                                        <button class="p-3 text-gray-600 hover:text-gray-800">
                                            Log in
                                        </button>
                                    </m.route.Link>
                                </div>
                                <div>
                                    <m.route.Link href="/auth/signup">
                                        <button class="p-3 text-accent-600 hover:text-accent-300">
                                            Start now
                                        </button>
                                    </m.route.Link>
                                </div>
                            </div>
                        </div>
                        {/* hero */}
                        <div class="flex flex-col mx-auto my-16 md:my-32 text-center">
                            <div class="text-gray-800 text-2xl leading-tight">
                                <span class="text-black font-bold">
                                    Comparator
                                </span>
                                <span class="ml-3">
                                    for fine art shippers
                                </span>
                            </div>
                            <div class="my-8 text-gray-700 text-xl">
                                Compare shipping quotes from all over the world and save money by selecting the best shippers.
                            </div>
                            <div class="flex flex-col sm:flex-row items-center justify-center mt-8">
                                <button class="flex items-center justify-center px-6 py-3 rounded shadow-md hover:shadow-lg font-bold mb-4 sm:mb-0 sm:mr-4
                                    transition duration-150 transform md:hover:-translate-y-px
                                    bg-accent-500 hover:bg-accent-300 text-white">
                                    <span>
                                        Get started
                                    </span>
                                    <Icon name="arrow-right" class="w-4 ml-2 text-white" />
                                </button>
                                <button class="flex flex-center justify-center px-6 py-3 rounded shadow-md hover:shadow-lg font-bold
                                    transition duration-150 transform md:hover:-translate-y-px
                                    bg-white hover:text-gray-700 text-gray-800">
                                    <span>
                                        Contact us
                                    </span>
                                    <Icon name="mail" class="w-4 ml-2 text-gray-800" />
                                </button>
                            </div>
                        </div>
                        {/* product */}
                        <div>
                            {/* information */}
                            <div class="flex flex-col items-center mt-20">
                                <span class="font-bold pb-4 border-b text-2xl text-center text-black">
                                    The better way to pick shippers
                                </span>
                                <div class="flex flex-col md:flex-row items-baseline mt-12 text-lg">
                                    <div class="flex flex-col items-center text-center sm:px-6 mb-16 md:mb-0">
                                        <img class="w-12 mb-4 opacity-75" src={notepad}/>
                                        <span class="block font-bold mb-4 whitespace-no-wrap text-gray-800">
                                            Better decisions
                                        </span>
                                        <span class="block w-1/2 md:w-full text-gray-600">
                                            Always know what different shippers will quote and make better decisions.
                                        </span>
                                    </div>
                                    <div class="flex flex-col items-center text-center sm:px-6 mb-16 md:mb-0">
                                        <img class="w-12 mb-4 opacity-75" src={clock} />
                                        <span class="block font-bold mb-4 whitespace-no-wrap text-gray-800">
                                            Save time
                                        </span>
                                        <span class="block w-1/2 md:w-full text-gray-600">
                                            Let us reach out to dozens of shippers for you to save precious time.
                                        </span>
                                    </div>
                                    <div class="flex flex-col items-center text-center sm:px-6 mb-16 md:mb-0">
                                        <img class="w-12 mb-4 opacity-75" src={money} />
                                        <span class="block font-bold mb-4 whitespace-no-wrap text-gray-800">
                                            Save money
                                        </span>
                                        <span class="block w-1/2 md:w-full text-gray-600">
                                            Get the best quotes for all your shipments and make tremendous savings.
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {/* explanation */}
                            <div class="flex flex-col items-center mt-12 md:mt-20">
                                <span class="font-bold pb-4 border-b text-2xl text-center text-black">
                                    How it works
                                </span>
                                <div class="flex flex-col md:flex-row items-baseline mt-12 text-lg">
                                    <div class="flex flex-col items-center text-center md:w-1/3 sm:px-6 mb-12 md:mb-0">
                                        <span class="font-bold text-5xl text-gray-800">
                                            1
                                        </span>
                                        <span class="block font-bold mb-4 whitespace-no-wrap text-gray-800">
                                            Fill out your request
                                        </span>
                                        <span class="block w-1/2 md:w-full text-gray-600">
                                            Give us information about the item(s) you want to ship anywhere in the world.
                                        </span>
                                    </div>
                                    <div class="flex flex-col items-center text-center md:w-1/3 sm:px-6 mb-12 md:mb-0">
                                        <span class="font-bold text-5xl text-gray-800">
                                            2
                                        </span>
                                        <span class="block font-bold mb-4 whitespace-no-wrap text-gray-800">
                                            We contact shippers
                                        </span>
                                        <span class="block w-1/2 md:w-full text-gray-600">
                                            We get in contact with shippers eligible to handle your request for you.
                                        </span>
                                    </div>
                                    <div class="flex flex-col items-center text-center md:w-1/3 sm:px-6 mb-12 md:mb-0">
                                        <span class="font-bold text-5xl text-gray-800">
                                            3
                                        </span>
                                        <span class="block font-bold mb-4 whitespace-no-wrap text-gray-800">
                                            Get the best price
                                        </span>
                                        <span class="block w-1/2 md:w-full text-gray-600">
                                            You receive a list of relevant quotes on your personal dashboard.
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* pricing */}
                        {/* <div class="my-12 md:mt-24">
                            <div class="flex flex-col items-center" id="pricing">
                                <span class="font-bold pb-4 border-b text-2xl text-black">
                                    Simple, flexible pricing
                                </span>
                                <div class="mt-4 text-lg text-gray-600 text-center">
                                    <div>
                                        Pay upfront whenever you need to compare shippers.
                                    </div>
                                </div>
                                <div class="w-full flex flex-col items-stretch md:flex-row justify-between mt-12">
                                    <div class="w-1/2 flex flex-col md:mr-3 p-6 rounded-md border border-gray-200">
                                        <div class="flex flex-col items-start flex-grow">
                                            <div class="font-bold text-lg text-accent-400">
                                                Standard
                                            </div>
                                            <div class="flex items-baseline my-2">
                                                <span class="font-bold text-2xl text-black">
                                                    $9.99
                                                </span>
                                                <span class="ml-2 text-gray-500">
                                                    / shipment
                                                </span>
                                            </div>
                                            <div class="text-gray-600">
                                                Perfect for single-time or occasional uses.
                                            </div>
                                        </div>
                                        <div class="flex flex-col">
                                            <div class="my-6">
                                                <div class="flex items-center">
                                                    <Icon name="check" class="w-5 mr-3 text-accent-400" />
                                                    <span>
                                                        Personal dashboard to track shipments
                                                    </span>
                                                </div>
                                                <div class="flex items-center mt-4">
                                                    <Icon name="check" class="w-5 mr-3 text-accent-400" />
                                                    <span>
                                                        Access to a large database of shippers
                                                    </span>
                                                </div>
                                                <div class="flex items-center mt-4">
                                                    <Icon name="check" class="w-5 mr-3 text-accent-400" />
                                                    <span>
                                                        Live chat and support
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <button class="flex items-center justify-center w-full rounded py-2 font-bold shadow-md hover:shadow-lg
                                                bg-accent-500 hover:bg-accent-400 text-white transition duration-150">
                                                <span>
                                                    Get started
                                                </span>
                                                <Icon name="arrow-right" class="w-4 ml-2" />
                                            </button>
                                        </div>
                                    </div>
                                    <div class="w-1/2 flex flex-col mt-4 md:mt-0 md:ml-3 p-6 rounded-md border border-gray-200">
                                        <div class="flex flex-col items-start flex-grow">
                                            <div class="flex items-center font-bold text-lg text-indigo-400">
                                                Enterprise
                                            </div>
                                            <div class="my-2 font-bold text-2xl text-black">
                                                Custom
                                            </div>
                                            <div class="text-gray-600">
                                                Suited for entities ready to integrate our service.
                                            </div>
                                        </div>
                                        <div class="flex flex-col">
                                            <div class="my-6">
                                                <div class="flex items-center">
                                                    <Icon name="corner-down-right" class="w-5 mr-3 text-accent-400" />
                                                    <span class="font-bold text-accent-400">
                                                        Everything in Standard
                                                    </span>
                                                </div>
                                                <div class="flex items-center mt-4">
                                                    <Icon name="check" class="w-5 mr-3 text-indigo-400" />
                                                    <span>
                                                        Unlimited amount of requests
                                                    </span>
                                                </div>
                                                <div class="flex items-center mt-4">
                                                    <Icon name="check" class="w-5 mr-3 text-indigo-400" />
                                                    <span>
                                                        Something additional
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <button class="flex items-center justify-center w-full rounded py-2 font-bold shadow-md hover:shadow-lg
                                                bg-indigo-500 hover:bg-indigo-400 text-white transition duration-150">
                                                Get in touch
                                                <Icon name="mail" class="w-4 ml-2" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                        {/* footer */}
                        <div class="flex flex-col my-16 text-center">
                            <span class="text-gray-600">
                                <button class="focus:outline-none hover:text-gray-700" id="contact-btn">
                                    Have questions? Contact us
                                </button>
                            </span>
                            <span class="mt-8 text-gray-500">
                                <button class="focus:outline-none hover:text-gray-600" id="copyright-btn">
                                    © Wecompart
                                </button>
                                <span class="mx-2">
                                    ·
                                </span>
                                <button class="focus:outline-none hover:text-gray-600" id="terms-btn">
                                    Privacy & Terms
                                </button>
                            </span>
                        </div>
                    </div>
                </div>
            </main>
        );
    }
}
