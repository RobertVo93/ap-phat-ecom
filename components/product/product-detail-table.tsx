import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table"
import { IProduct } from "@/types"
import { Card, CardContent, CardHeader } from "../ui/card"
import { useLanguage } from "@/lib/contexts/language-context";
import { formatCurrency } from "@/lib/utils.currency";

interface Props {
  product: IProduct
}

export function ProductDetailTable({ product }: Props) {
  const { t } = useLanguage();
  return (
    <Card className='mt-10 p-5'>
      <CardHeader className='font-bold text-lg bg-slate-100'>
        {t("product.description")}
      </CardHeader>
      <CardContent className='mt-5'>
        <Table>
          <TableBody className="text-md">
            <TableRow>
              <TableCell>{t("product.name")}</TableCell>
              <TableCell>{product.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{t("product.sku")}</TableCell>
              <TableCell>{product.sku}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{t("product.unit")}</TableCell>
              <TableCell>{t(`product.unit.${product.unit}`)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{t("product.description")}</TableCell>
              <TableCell>{product.description}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{t("product.price")}</TableCell>
              <TableCell>{formatCurrency(product.price!)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{t("product.supplier")}</TableCell>
              <TableCell>{product.supplier}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>

  )
}
