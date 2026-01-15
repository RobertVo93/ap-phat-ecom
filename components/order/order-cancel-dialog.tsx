import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/contexts/language-context";
import { AlertCircle } from "lucide-react";

interface Props {
  id: string
  handleCancelOrder: (id: string) => void
}

export function OrderCancelDialog({
  id,
  handleCancelOrder
}: Props) {
  const { t } = useLanguage();

  const onCancel = async () => {
    handleCancelOrder(id)
  }
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-red-500 text-red-600 hover:bg-red-500 hover:text-white"
        >
          <AlertCircle className="w-4 h-4 mr-2" />
          {t('order.detail.cancel')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('order.detail.alert')}</DialogTitle>
        </DialogHeader>
        <p>{t('order.detail.cancelConfirm')}</p>
        <p>{t('order.detail.thisActionCantUndo')}</p>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">
              {t("order.action.cancel")}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              variant="outline"
              className="border-red-500 text-red-600 hover:bg-red-500 hover:text-white"
              onClick={onCancel}
            >
              {t("order.action.confirm")}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog >
  )
}
