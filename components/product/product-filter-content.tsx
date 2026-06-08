import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/contexts/language-context';
import { ICollection } from '@/types';

interface Props {
    collections: ICollection[]
    priceRange: [number, number]
    setPriceRange: (value: [number, number]) => void
}

export default function FilterContent({
    collections,
    priceRange,
    setPriceRange,
}: Props) {
    const { t } = useLanguage();
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams();
    const selectedCollection = searchParams.get('collection') ?? "";

    const updateCollectionParam = (collectionNumber: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (collectionNumber) {
            params.set('collection', collectionNumber);
        } else {
            params.delete('collection');
        }

        const queryString = params.toString();
        router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
    }

    return (
        <div className="space-y-6">
            {/* Collection Filter */}
            <div>
                <h3 className="font-semibold text-[#573e1c] mb-4 text-lg">{t('product.filter.categories')}</h3>
                <div className="space-y-3">
                    {collections.map((collection) => (
                        <div key={collection.id} className="flex items-center space-x-3">
                            <Checkbox
                                id={collection.id}
                                checked={selectedCollection !== "" && selectedCollection === collection.number}
                                onCheckedChange={(checked) => {
                                    if (checked && collection.number) updateCollectionParam(collection.number);
                                    else updateCollectionParam('');
                                }}
                                className="border-[#8b6a42] data-[state=checked]:bg-[#573e1c] data-[state=checked]:border-[#573e1c]"
                            />
                            <label
                                htmlFor={collection.id}
                                className="text-[#8b6a42] cursor-pointer hover:text-[#573e1c] transition-colors"
                            >
                                {collection.name}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            <Separator className="bg-[#d4c5a0]" />

            {/* Price Range */}
            <div>
                <h3 className="font-semibold text-[#573e1c] mb-4 text-lg">{t('product.filter.priceRange')}</h3>
                <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                        <Checkbox
                            id="price-under-20k"
                            checked={priceRange[1] <= 20000}
                            onCheckedChange={(checked) => {
                                if (checked) setPriceRange([0, 20000]);
                                else setPriceRange([0, 100_000]);
                            }}
                            className="border-[#8b6a42] data-[state=checked]:bg-[#573e1c] data-[state=checked]:border-[#573e1c]"
                        />
                        <label
                            htmlFor="price-under-20k"
                            className="text-[#8b6a42] cursor-pointer hover:text-[#573e1c] transition-colors"
                        >
                            {t('product.filter.priceUnder')}
                        </label>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Checkbox
                            id="price-20k-50k"
                            checked={priceRange[0] >= 20000 && priceRange[1] <= 50000}
                            onCheckedChange={(checked) => {
                                if (checked) setPriceRange([20000, 50000]);
                                else setPriceRange([0, 100_000]);
                            }}
                            className="border-[#8b6a42] data-[state=checked]:bg-[#573e1c] data-[state=checked]:border-[#573e1c]"
                        />
                        <label
                            htmlFor="price-20k-50k"
                            className="text-[#8b6a42] cursor-pointer hover:text-[#573e1c] transition-colors"
                        >
                            {t('product.filter.priceBetween')}
                        </label>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Checkbox
                            id="price-above-50k"
                            checked={priceRange[0] >= 50000}
                            onCheckedChange={(checked) => {
                                if (checked) setPriceRange([50000, 100000]);
                                else setPriceRange([0, 100_000]);
                            }}
                            className="border-[#8b6a42] data-[state=checked]:bg-[#573e1c] data-[state=checked]:border-[#573e1c]"
                        />
                        <label
                            htmlFor="price-above-50k"
                            className="text-[#8b6a42] cursor-pointer hover:text-[#573e1c] transition-colors"
                        >
                            {t('product.filter.priceAbove')}
                        </label>
                    </div>
                </div>
            </div>

            <Separator className="bg-[#d4c5a0]" />

            {/* Clear Filters */}
            <Button
                variant="outline"
                onClick={() => {
                    router.replace(pathname, { scroll: false });
                }}
                className="w-full border-[#573e1c] text-[#573e1c] hover:bg-[#573e1c] hover:text-[#efe1c1]"
            >
                {t('product.filter.clear')}
            </Button>
        </div>
    );
}
