"use client";
import { Mail, Phone, MapPin, Send, Clock, MessageSquare } from 'lucide-react';
import { useForm } from 'react-hook-form';

export default function Contact() {

    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: '',
        }
    })


    const onSubmit = async (data: any) => {

        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, String(value));
        });

        formData.append("_subject", "New Codelevate Enquiry");
        formData.append("_captcha", "false");

        const response = await fetch("https://formsubmit.co/ajax/info@codelevate.tech", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            alert("Form submitted successfully!");
            reset();
        } else {
            alert("Submission failed");
        }

    };


    const contactInfo = [
        {
            icon: Mail,
            title: 'Email Us',
            details: ['info@codelevate.tech'],
            gradient: 'from-emerald-500 to-teal-500',
        },
        {
            icon: Phone,
            title: 'Call Us',
            details: ['+91 9540441958',],
            gradient: 'from-cyan-500 to-blue-500',
        },
        {
            icon: MapPin,
            title: 'Visit Us',
            details: ['i-thum tower, noida, U.P'],
            gradient: 'from-violet-500 to-purple-500',
        },
        {
            icon: Clock,
            title: 'Business Hours',
            details: ['24/7'],
            gradient: 'from-fuchsia-500 to-pink-500',
        },
    ];

    return (
        <div className="bg-black">
            {/* Hero Section */}
            <section className="relative py-20 md:py-32 bg-gradient-to-br from-gray-950 via-black to-gray-950 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(16,185,129,0.1),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(20,184,166,0.1),transparent_50%)]" />
                <div className="container mx-auto px-4 relative">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-6xl mb-6 text-white">Get In Touch</h1>
                        <p className="text-xl md:text-2xl text-gray-300">
                            Let's discuss how we can help bring your vision to life
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-white/10">
                            <h2 className="text-3xl mb-6 text-white">Send Us a Message</h2>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div className='flex flex-col gap-4 justify-start items-start w-full'>
                                    <label htmlFor="name" className="text-gray-300">Full Name *</label>
                                    <input
                                        id="name"
                                        type="text"
                                        required
                                        {...register("name")}
                                        placeholder="Enter Your Name..."
                                        className=" bg-black w-full px-4 py-2 rounded-xl border-white/10 text-white placeholder:text-gray-500"
                                    />
                                </div>

                                <div className='flex flex-col gap-4 justify-start items-start w-full'>
                                    <label htmlFor="email" className="text-gray-300">Email Address *</label>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        {...register("email")}
                                        placeholder="Enter Your Email..."
                                        className=" bg-black w-full px-4 py-2 rounded-xl border-white/10 text-white placeholder:text-gray-500"
                                    />
                                </div>

                                <div className='flex flex-col gap-4 justify-start items-start w-full'>
                                    <label htmlFor="phone" className="text-gray-300">Phone Number</label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        {...register("phone")}
                                        placeholder="Enter Your Phone..."
                                        className=" bg-black w-full px-4 py-2 rounded-xl border-white/10 text-white placeholder:text-gray-500"
                                    />
                                </div>

                                <div className='flex flex-col gap-4 justify-start items-start w-full'>
                                    <label htmlFor="subject" className="text-gray-300">Subject *</label>
                                    <input
                                        id="subject"
                                        type="text"
                                        required
                                        {...register("subject")}
                                        placeholder="Project Inquiry"
                                        className=" bg-black w-full px-4 py-2 rounded-xl border-white/10 text-white placeholder:text-gray-500"
                                    />
                                </div>

                                <div className='flex flex-col gap-4 justify-start items-start w-full'>
                                    <label htmlFor="message" className="text-gray-300">Message *</label>
                                    <textarea
                                        id="message"
                                        required
                                        {...register("message")}
                                        placeholder="Tell us about your project..."
                                        rows={6}
                                        className=" bg-black w-full px-4 py-2 rounded-xl border-white/10 text-white placeholder:text-gray-500"
                                    />
                                </div>

                                <button type="submit" className="flex justify-center items-center flex-row rounded-full py-2 gap-2 font-bold text-[4vw] lg:text-[1.3vw] px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-black">
                                    <p>Send Message</p>
                                    <Send className="w-5 h-5 font-bold flex rotate-40" />
                                </button>
                            </form>
                        </div>

                        {/* Contact Information */}
                        <div>
                            <div className="mb-8">
                                <h2 className="text-3xl mb-6 text-white">Contact Information</h2>
                                <p className="text-gray-400 mb-8">
                                    Have questions? We'd love to hear from you. Send us a message and
                                    we'll respond as soon as possible.
                                </p>
                            </div>

                            <div className="space-y-4">
                                {contactInfo.map((info, index) => (
                                    <div
                                        key={index}
                                        className="group relative bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl border border-white/10 hover:border-white/20 transition-all overflow-hidden"
                                    >
                                        <div className={`absolute inset-0 bg-gradient-to-br ${info.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
                                        <div className="flex items-start gap-4 relative">
                                            <div className={`w-12 h-12 bg-gradient-to-br ${info.gradient}/10 rounded-full shadow-lg shadow-gray-500 flex items-center justify-center flex-shrink-0`}>
                                                <info.icon className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg mb-1 text-white">{info.title}</h3>
                                                {info.details.map((detail, detailIndex) => (
                                                    <p key={detailIndex} className="text-gray-400">{detail}</p>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 relative group bg-gradient-to-br from-emerald-900/20 to-teal-900/20 p-6 rounded-xl border border-emerald-500/20 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative">
                                    <MessageSquare className="w-12 h-12 mb-4 text-emerald-400" />
                                    <h3 className="text-xl mb-2 text-white">Need Immediate Assistance?</h3>
                                    <p className="text-gray-400 mb-4">
                                        Our support team is available 24/7 to help you with urgent matters.
                                    </p>
                                    <button className="border border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 px-4 py-2 rounded-full font-semibold transition-all">
                                        Start Live Chat
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="py-16 bg-gradient-to-b from-black via-gray-950 to-black">
                <div className="container mx-auto px-4">
                    <div className="bg-gradient-to-br from-gray-900 to-black h-96 rounded-2xl flex items-center justify-center border border-white/10">
                        <div className="text-center text-gray-500">
                            <MapPin className="w-16 h-16 mx-auto mb-4 text-emerald-400" />
                            <p>Map integration would go here</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-5xl mb-12 text-center text-white">Frequently Asked Questions</h2>

                        <div className="space-y-4">
                            <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl border border-white/10 hover:border-white/20 transition-all">
                                <h3 className="text-xl mb-2 text-white">What is your typical project timeline?</h3>
                                <p className="text-gray-400">
                                    Project timelines vary depending on complexity, but most projects take 4-12 weeks.
                                    We provide detailed timelines during the initial consultation.
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl border border-white/10 hover:border-white/20 transition-all">
                                <h3 className="text-xl mb-2 text-white">Do you offer payment plans?</h3>
                                <p className="text-gray-400">
                                    Yes! We offer flexible payment plans to accommodate different budgets.
                                    Contact us to discuss options that work for you.
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl border border-white/10 hover:border-white/20 transition-all">
                                <h3 className="text-xl mb-2 text-white">What happens after project completion?</h3>
                                <p className="text-gray-400">
                                    We provide ongoing maintenance and support packages to ensure your solution
                                    continues to run smoothly. We're here for you long after launch.
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-xl border border-white/10 hover:border-white/20 transition-all">
                                <h3 className="text-xl mb-2 text-white">Can you work with our existing systems?</h3>
                                <p className="text-gray-400">
                                    Absolutely! We specialize in integrating with existing systems and can
                                    modernize legacy applications while preserving your data and workflows.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
