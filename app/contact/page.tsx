'use client';

import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle, User, Building } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/language-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ContactPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    inquiryType: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSubmitMessage(t('contact.form.success'));
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      inquiryType: ''
    });
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: t('contact.info.phone'),
      details: ['028 3823 4567', '0901 234 567'],
      description: t('contact.info.phone.hours')
    },
    {
      icon: Mail,
      title: t('contact.info.email'),
      details: ['contact@ricepaperstore.vn', 'support@ricepaperstore.vn'],
      description: t('contact.info.email.response')
    },
    {
      icon: MapPin,
      title: t('contact.info.address'),
      details: ['123 Đường Lê Lợi, Phường Bến Nghé', 'Quận 1, TP. Hồ Chí Minh'],
      description: t('contact.info.address.main')
    },
    {
      icon: Clock,
      title: t('contact.info.hours'),
      details: [t('contact.info.hours.weekdays'), t('contact.info.hours.weekend')],
      description: t('contact.info.hours.description')
    }
  ];

  const inquiryTypes = [
    { value: 'general', label: t('contact.form.inquiryType.options.general') },
    { value: 'product', label: t('contact.form.inquiryType.options.product') },
    { value: 'order', label: t('contact.form.inquiryType.options.order') },
    { value: 'wholesale', label: t('contact.form.inquiryType.options.wholesale') },
    { value: 'partnership', label: t('contact.form.inquiryType.options.partnership') },
    { value: 'complaint', label: t('contact.form.inquiryType.options.complaint') },
    { value: 'other', label: t('contact.form.inquiryType.options.other') }
  ];

  return (
    <div className="min-h-screen bg-[#f8f5f0]">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#573e1c] to-[#8b6a42] py-16 lg:py-24">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-[#efe1c1] mb-6">
            {t('nav.contact')}
          </h1>
          <p className="text-xl text-[#d4c5a0] max-w-3xl mx-auto leading-relaxed">
            {t('contact.hero.subtitle')}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Contact Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, index) => (
            <Card key={index} className="bg-white border-[#d4c5a0] hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-[#573e1c] rounded-full flex items-center justify-center mx-auto mb-4">
                  <info.icon className="w-8 h-8 text-[#efe1c1]" />
                </div>
                <h3 className="font-bold text-[#573e1c] text-lg mb-3">{info.title}</h3>
                <div className="space-y-1 mb-3">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-[#8b6a42] font-medium">{detail}</p>
                  ))}
                </div>
                <p className="text-sm text-[#8b6a42]">{info.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="bg-white border-[#d4c5a0] shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#573e1c] flex items-center text-2xl">
                <MessageCircle className="w-6 h-6 mr-3" />
                {t('contact.form.title')}
              </CardTitle>
              <p className="text-[#8b6a42]">
                {t('contact.form.subtitle')}
              </p>
            </CardHeader>
            <CardContent>
              {submitMessage && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-600 rounded-lg">
                  {submitMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-[#573e1c] flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {t('contact.form.name')}
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="border-[#8b6a42] focus:border-[#573e1c]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-[#573e1c] flex items-center">
                      <Phone className="w-4 h-4 mr-1" />
                      {t('contact.form.phone')}
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="border-[#8b6a42] focus:border-[#573e1c]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#573e1c] flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    {t('contact.form.email')}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="border-[#8b6a42] focus:border-[#573e1c]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inquiryType" className="text-[#573e1c] flex items-center">
                    <Building className="w-4 h-4 mr-1" />
                    {t('contact.form.inquiryType')}
                  </Label>
                  <Select value={formData.inquiryType} onValueChange={(value) => setFormData({...formData, inquiryType: value})}>
                    <SelectTrigger className="border-[#8b6a42]">
                      <SelectValue placeholder={t('contact.form.inquiryType.placeholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {inquiryTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-[#573e1c]">{t('contact.form.subject')}</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="border-[#8b6a42] focus:border-[#573e1c]"
                    placeholder={t('contact.form.subject.placeholder')}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-[#573e1c]">{t('contact.form.message')}</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="border-[#8b6a42] focus:border-[#573e1c] min-h-[120px]"
                    placeholder={t('contact.form.message.placeholder')}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#573e1c] hover:bg-[#8b6a42] text-[#efe1c1] h-12 text-lg font-semibold disabled:bg-gray-300"
                >
                  <Send className="w-5 h-5 mr-2" />
                  {isSubmitting ? t('contact.form.submitting') : t('contact.form.submit')}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Map and Additional Info */}
          <div className="space-y-6">
            {/* Map Placeholder */}
            <Card className="bg-white border-[#d4c5a0] shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#573e1c] flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  {t('contact.map.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gradient-to-br from-[#efe1c1] to-[#d4c5a0] rounded-lg flex items-center justify-center">
                  <div className="text-center text-[#573e1c]">
                    <MapPin className="w-16 h-16 mx-auto mb-4" />
                    <p className="font-semibold">{t('contact.map.placeholder')}</p>
                    <p className="text-sm text-[#8b6a42]">{t('contact.map.address')}</p>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-[#f8f5f0] rounded-lg">
                  <h4 className="font-semibold text-[#573e1c] mb-2">{t('contact.map.directions')}</h4>
                  <ul className="text-sm text-[#8b6a42] space-y-1">
                    <li>• {t('contact.map.directions.airport')}</li>
                    <li>• {t('contact.map.directions.metro')}</li>
                    <li>• {t('contact.map.directions.parking')}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card className="bg-white border-[#d4c5a0] shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#573e1c]">{t('contact.faq.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-l-4 border-[#573e1c] pl-4">
                  <h4 className="font-semibold text-[#573e1c] mb-1">{t('contact.faq.delivery.question')}</h4>
                  <p className="text-sm text-[#8b6a42]">{t('contact.faq.delivery.answer')}</p>
                </div>
                <div className="border-l-4 border-[#573e1c] pl-4">
                  <h4 className="font-semibold text-[#573e1c] mb-1">{t('contact.faq.freeShipping.question')}</h4>
                  <p className="text-sm text-[#8b6a42]">{t('contact.faq.freeShipping.answer')}</p>
                </div>
                <div className="border-l-4 border-[#573e1c] pl-4">
                  <h4 className="font-semibold text-[#573e1c] mb-1">{t('contact.faq.wholesale.question')}</h4>
                  <p className="text-sm text-[#8b6a42]">{t('contact.faq.wholesale.answer')}</p>
                </div>
                <div className="border-l-4 border-[#573e1c] pl-4">
                  <h4 className="font-semibold text-[#573e1c] mb-1">{t('contact.faq.return.question')}</h4>
                  <p className="text-sm text-[#8b6a42]">{t('contact.faq.return.answer')}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}