export default function PromoCard() {
  return (
    <div className="relative flex h-48 flex-col justify-end overflow-hidden rounded-lg p-8">
      {/* Gradient background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(153deg, rgba(255,177,72,0.2) 0%, rgba(255,177,72,0) 100%)',
        }}
      />

      {/* Content */}
      <div className="relative flex flex-col gap-2">
        <h3 className="text-xl font-bold text-[#ffb148]">Tự động hóa dữ liệu?</h3>
        <p className="text-sm leading-5 text-[rgba(231,228,236,0.8)]">
          Kết nối API để cập nhật giá thời gian thực từ các sàn lớn.
        </p>
      </div>
    </div>
  )
}
