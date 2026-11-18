import Image from 'next/image';

export function ProductPackagingImage() {
  return (
    <section className="mx-auto max-w-[1536px] px-4 pb-12 sm:px-6 lg:px-8">
      <Image
        src="/mock_10.jpg"
        alt="Nhãn bánh tráng An Phát với thông tin thành phần, hướng dẫn sử dụng, bảo quản và dinh dưỡng"
        width={1902}
        height={827}
        sizes="(max-width: 1536px) 100vw, 1536px"
        className="h-auto w-full rounded-2xl"
      />
    </section>
  );
}
