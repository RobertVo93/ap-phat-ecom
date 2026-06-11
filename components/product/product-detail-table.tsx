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

interface Props {
  product: IProduct
}

export function ProductDetailTable({ product }: Props) {
  const { t } = useLanguage();
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
