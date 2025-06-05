import { createClient } from "@/src/lib/supabase/server"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">대시보드</h2>
        <p className="text-gray-500">안녕하세요, {user?.email}님!</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* 오늘의 업무 카드 */}
        <div className="bg-white rounded-lg shadow p-4 flex flex-col justify-between border">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium">오늘의 업무</h3>
          </div>
          <div>
            <div className="text-2xl font-bold">진행중</div>
            <p className="text-xs text-gray-500">업무 시작 준비</p>
          </div>
        </div>
        
        {/* 이번 주 근무일 카드 */}
        <div className="bg-white rounded-lg shadow p-4 flex flex-col justify-between border">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium">이번 주 근무일</h3>
          </div>
          <div>
            <div className="text-2xl font-bold">0일</div>
            <p className="text-xs text-gray-500">총 0시간</p>
          </div>
        </div>
        
        {/* 필요에 따라 카드 추가 */}
      </div>
    </div>
  )
}
