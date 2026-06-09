'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/language-context';
import { Button } from '@/components/ui/button';

export function HeroSectionAction() {
	const { t } = useLanguage();

	return (
		<div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
			<Button
				asChild
				size="lg"
				className="bg-[#573e1c] hover:bg-[#8b6a42] text-[#efe1c1] px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
			>
				<Link href="/products">
					{t('home.hero.cta')}
					<ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
				</Link>
			</Button>

			<Button
				asChild
				size="lg"
				variant="outline"
				className="border-[#573e1c] text-[#573e1c] hover:bg-[#573e1c] hover:text-[#efe1c1] px-8 py-4 text-lg shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
			>
				<Link href="/store-locations">
					{t('store.locations')}
				</Link>
			</Button>
		</div>
	);
}