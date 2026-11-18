const SECTION_TITLES = new Set([
  "Thông tin sản phẩm",
  "Câu chuyện sản phẩm",
  "Thông tin lô hiển thị khi quét QR",
])

interface ProductDescriptionProps {
  description?: string | null
}

export function ProductDescription({ description }: ProductDescriptionProps) {
  if (!description?.trim()) return null

  const lines = description.split(/\r?\n/).map((line) => line.trim())

  return (
    <div className="space-y-4 text-[#8b6a42]">
      {lines.map((line, index) => {
        if (!line) return null

        const heading = line.match(/^#{1,3}\s+(.+)$/)?.[1]
        if (heading || SECTION_TITLES.has(line)) {
          return (
            <h3 key={index} className="pt-2 text-lg font-bold text-[#654525] first:pt-0">
              {heading ?? line}
            </h3>
          )
        }

        if (lines[index - 1] === "Câu chuyện sản phẩm") {
          return <h4 key={index} className="font-semibold text-[#654525]">{line}</h4>
        }

        const fields = line.match(/^(.+?)\s{2,}(.+)$/)
        if (fields) {
          return (
            <div key={index} className="grid gap-1 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-4">
              <span className="font-semibold text-[#654525]">{fields[1]}</span>
              <span className="min-w-0 whitespace-pre-wrap break-words">{fields[2]}</span>
            </div>
          )
        }

        return <p key={index} className="whitespace-pre-wrap break-words leading-relaxed">{line}</p>
      })}
    </div>
  )
}
