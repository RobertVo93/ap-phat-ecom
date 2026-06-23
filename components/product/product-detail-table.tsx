import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table"
import { IProduct } from "@/types"
import { Card } from "@/components/ui/card"
import { useLanguage } from "@/lib/contexts/language-context";
import { formatCurrency } from "@/lib/utils.currency";
import { getSortedTierPrices } from "@/lib/product-pricing";

interface Props {
  product: IProduct
}

export function ProductDetailTable({ product }: Props) {
  const { t } = useLanguage();
  const tierPrices = getSortedTierPrices(product.tierPrices);

  return (
    <Card className='mt-10 p-5'>
        <Table>
          <TableBody className="text-md text-[#8b6a42]">
            <TableRow>
              <TableCell className="font-bold">{t("product.name")}</TableCell>
              <TableCell>{product.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-bold">{t("product.sku")}</TableCell>
              <TableCell>{product.sku}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-bold">{t("product.price")}</TableCell>
              <TableCell>{formatCurrency(product.price!)}</TableCell>
            </TableRow>
            {tierPrices.length > 0 && (
              <TableRow>
                <TableCell className="font-bold">{t("product.wholesalePrices")}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {tierPrices.map((tier, index) => (
                      <div key={index}>
                        {tier.minQuantity}
                        {tier.maxQuantity ? ` - ${tier.maxQuantity}` : '+'}: {formatCurrency(tier.price)} / {t(`product.unit.${product.unit}`)}
                      </div>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            )}
            <TableRow>
              <TableCell className="font-bold">{t("product.unit")}</TableCell>
              <TableCell>{t(`product.unit.${product.unit}`)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-bold">{t("product.description")}</TableCell>
              <TableCell>{product.description}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
    </Card>

  )
}
