'use client';

import React from 'react';
import { Heart, Award, Users, Leaf, Clock, Star, Target, Globe } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/language-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AboutPage() {
  const { t } = useLanguage();

  const values = [
    {
      icon: Heart,
      title: 'Tình yêu truyền thống',
      description: 'Chúng tôi yêu và tôn trọng những giá trị ẩm thực truyền thống Việt Nam, từ đó tạo ra những sản phẩm chất lượng nhất.'
    },
    {
      icon: Award,
      title: 'Chất lượng hàng đầu',
      description: 'Cam kết mang đến sản phẩm chất lượng cao nhất với quy trình sản xuất nghiêm ngặt và nguyên liệu tươi ngon.'
    },
    {
      icon: Users,
      title: 'Phục vụ tận tâm',
      description: 'Đặt khách hàng làm trung tâm, chúng tôi luôn lắng nghe và cải thiện để mang đến trải nghiệm tốt nhất.'
    },
    {
      icon: Leaf,
      title: 'Tự nhiên & An toàn',
      description: 'Sử dụng nguyên liệu tự nhiên, không chất bảo quản, đảm bảo an toàn thực phẩm cho sức khỏe gia đình bạn.'
    }
  ];

  const milestones = [
    {
      year: '2018',
      title: 'Thành lập công ty',
      description: 'Rice & Noodles được thành lập với sứ mệnh mang bánh tráng và bún phở truyền thống đến mọi gia đình Việt.'
    },
    {
      year: '2019',
      title: 'Mở rộng sản xuất',
      description: 'Đầu tư nhà máy sản xuất hiện đại tại Tây Ninh, áp dụng công nghệ tiên tiến vào quy trình sản xuất truyền thống.'
    },
    {
      year: '2020',
      title: 'Ra mắt cửa hàng đầu tiên',
      description: 'Khai trương cửa hàng đầu tiên tại Quận 1, TP.HCM, đánh dấu bước tiến quan trọng trong việc tiếp cận khách hàng.'
    },
    {
      year: '2021',
      title: 'Chứng nhận chất lượng',
      description: 'Đạt chứng nhận ISO 22000 về an toàn thực phẩm và nhiều giải thưởng về chất lượng sản phẩm.'
    },
    {
      year: '2022',
      title: 'Mở rộng thị trường',
      description: 'Phát triển hệ thống phân phối rộng khắp, phục vụ hơn 10.000 khách hàng trên toàn quốc.'
    },
    {
      year: '2023',
      title: 'Đổi mới số hóa',
      description: 'Ra mắt nền tảng thương mại điện tử, ứng dụng công nghệ để nâng cao trải nghiệm khách hàng.'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Khách hàng tin tưởng' },
    { number: '500+', label: 'Sản phẩm đa dạng' },
    { number: '50+', label: 'Đối tác phân phối' },
    { number: '99%', label: 'Khách hàng hài lòng' }
  ];

  const team = [
    {
      name: 'Nguyễn Văn Minh',
      position: 'Giám đốc điều hành',
      description: 'Với hơn 15 năm kinh nghiệm trong ngành thực phẩm, anh Minh đã dẫn dắt Rice & Noodles trở thành thương hiệu uy tín.',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg'
    },
    {
      name: 'Trần Thị Lan',
      position: 'Giám đốc sản xuất',
      description: 'Chuyên gia về công nghệ thực phẩm, chị Lan đảm bảo chất lượng sản phẩm luôn đạt tiêu chuẩn cao nhất.',
      image: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg'
    },
    {
      name: 'Lê Hoàng Nam',
      position: 'Giám đốc kinh doanh',
      description: 'Với tầm nhìn chiến lược, anh Nam đã xây dựng mạng lưới phân phối rộng khắp và phát triển thương hiệu.',
      image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg'
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8f5f0]">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#573e1c] to-[#8b6a42] py-16 lg:py-24">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold text-[#efe1c1] mb-6">
                Về Rice & Noodles
              </h1>
              <p className="text-xl text-[#d4c5a0] leading-relaxed mb-8">
                Chúng tôi là những người thợ thủ công tận tâm, mang đến hương vị đậm đà của bánh tráng và bún phở truyền thống Việt Nam cho mọi gia đình.
              </p>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#efe1c1]">6+</div>
                  <div className="text-sm text-[#d4c5a0]">Năm kinh nghiệm</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#efe1c1]">2</div>
                  <div className="text-sm text-[#d4c5a0]">Cửa hàng</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#efe1c1]">100%</div>
                  <div className="text-sm text-[#d4c5a0]">Tự nhiên</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/4331491/pexels-photo-4331491.jpeg"
                alt="Traditional Vietnamese food preparation"
                className="rounded-2xl shadow-2xl w-full h-[400px] object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-[#efe1c1] p-6 rounded-xl shadow-lg">
                <div className="flex items-center space-x-3">
                  <Star className="w-8 h-8 text-yellow-500 fill-current" />
                  <div>
                    <div className="font-bold text-[#573e1c] text-lg">4.9/5</div>
                    <div className="text-sm text-[#8b6a42]">Đánh giá khách hàng</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Mission & Vision */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-white border-[#d4c5a0] shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#573e1c] flex items-center text-2xl">
                  <Target className="w-6 h-6 mr-3" />
                  Sứ mệnh
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#8b6a42] leading-relaxed text-lg">
                  Bảo tồn và phát triển những giá trị ẩm thực truyền thống Việt Nam, mang đến cho mọi gia đình những sản phẩm bánh tráng và bún phở chất lượng cao, an toàn và đậm đà hương vị quê hương.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-[#d4c5a0] shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#573e1c] flex items-center text-2xl">
                  <Globe className="w-6 h-6 mr-3" />
                  Tầm nhìn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#8b6a42] leading-relaxed text-lg">
                  Trở thành thương hiệu hàng đầu Việt Nam về bánh tráng và bún phở truyền thống, được khách hàng tin tưởng và lựa chọn, đồng thời lan tỏa văn hóa ẩm thực Việt ra thế giới.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Core Values */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#573e1c] mb-4">
              Giá trị cốt lõi
            </h2>
            <p className="text-[#8b6a42] text-lg max-w-3xl mx-auto">
              Những giá trị này định hướng mọi hoạt động của chúng tôi và tạo nên sự khác biệt trong từng sản phẩm
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="bg-white border-[#d4c5a0] hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-[#573e1c] rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-[#efe1c1]" />
                  </div>
                  <h3 className="font-bold text-[#573e1c] text-lg mb-3">{value.title}</h3>
                  <p className="text-[#8b6a42] text-sm leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Statistics */}
        <section className="mb-16">
          <Card className="bg-gradient-to-r from-[#573e1c] to-[#8b6a42] border-none shadow-lg">
            <CardContent className="p-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-4xl lg:text-5xl font-bold text-[#efe1c1] mb-2">
                      {stat.number}
                    </div>
                    <div className="text-[#d4c5a0] text-sm lg:text-base">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Timeline */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#573e1c] mb-4">
              Hành trình phát triển
            </h2>
            <p className="text-[#8b6a42] text-lg max-w-3xl mx-auto">
              Từ những ngày đầu khởi nghiệp đến hôm nay, chúng tôi không ngừng phát triển và hoàn thiện
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-[#d4c5a0]"></div>
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <Card className="bg-white border-[#d4c5a0] shadow-lg">
                      <CardContent className="p-6">
                        <Badge className="bg-[#573e1c] text-[#efe1c1] mb-3">
                          {milestone.year}
                        </Badge>
                        <h3 className="font-bold text-[#573e1c] text-lg mb-2">
                          {milestone.title}
                        </h3>
                        <p className="text-[#8b6a42] text-sm leading-relaxed">
                          {milestone.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="relative z-10">
                    <div className="w-4 h-4 bg-[#573e1c] rounded-full border-4 border-[#efe1c1]"></div>
                  </div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#573e1c] mb-4">
              Đội ngũ lãnh đạo
            </h2>
            <p className="text-[#8b6a42] text-lg max-w-3xl mx-auto">
              Những con người tài năng và tận tâm đã xây dựng nên thành công của Rice & Noodles
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="bg-white border-[#d4c5a0] hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="relative mb-6">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-[#efe1c1]"
                    />
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-[#573e1c] text-[#efe1c1] px-3 py-1 rounded-full text-xs font-semibold">
                      Leader
                    </div>
                  </div>
                  <h3 className="font-bold text-[#573e1c] text-xl mb-2">{member.name}</h3>
                  <p className="text-[#8b6a42] font-medium mb-3">{member.position}</p>
                  <p className="text-[#8b6a42] text-sm leading-relaxed">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section>
          <Card className="bg-gradient-to-r from-[#efe1c1] to-[#d4c5a0] border-[#8b6a42] shadow-lg">
            <CardContent className="p-8 text-center">
              <h2 className="text-3xl font-bold text-[#573e1c] mb-4">
                Cùng Rice & Noodles tạo nên những bữa cơm gia đình ấm cúng
              </h2>
              <p className="text-[#8b6a42] text-lg mb-8 max-w-2xl mx-auto">
                Hãy để chúng tôi đồng hành cùng bạn trong việc mang đến những món ăn truyền thống, ngon miệng và bổ dưỡng cho gia đình.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/products"
                  className="inline-flex items-center justify-center px-8 py-3 bg-[#573e1c] hover:bg-[#8b6a42] text-[#efe1c1] font-semibold rounded-lg transition-colors duration-200"
                >
                  Khám phá sản phẩm
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-3 border-2 border-[#573e1c] text-[#573e1c] hover:bg-[#573e1c] hover:text-[#efe1c1] font-semibold rounded-lg transition-colors duration-200"
                >
                  Liên hệ với chúng tôi
                </a>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}