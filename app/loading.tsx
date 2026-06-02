export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F6FA]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#4F6EF7] border-t-transparent" />
        <p className="text-sm text-[#6B7280]">Loading...</p>
      </div>
    </div>
  );
}
