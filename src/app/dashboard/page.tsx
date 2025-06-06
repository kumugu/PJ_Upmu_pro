import { createClient } from  "@/src/lib/supabase/server"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 환영 섹션 */}
      <div className="relative overflow-hidden">
        <div className="backdrop-blur-xl bg-white/10 dark:bg-gray-800/20 border border-gray-200 dark:border-gray-700 rounded-3xl p-8 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                안녕하세요, {user?.email?.split('@')[0]}님! 👋
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg">
                오늘도 효율적인 업무 관리로 목표를 달성해보세요
              </p>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-600 dark:text-green-400 rounded-full text-sm font-medium">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  온라인
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  마지막 로그인: {new Date().toLocaleDateString('ko-KR')}
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-lg">
                <span className="text-4xl">🚀</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 통계 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="오늘의 업무"
          value="진행중"
          subtitle="업무 시작 준비"
          change={15}
          icon="📋"
          color="blue"
        />
        <StatsCard
          title="이번 주 근무일"
          value="3일"
          subtitle="총 24시간"
          change={-5}
          icon="📅"
          color="green"
        />
        <StatsCard
          title="완료율"
          value="87%"
          subtitle="이번 달"
          change={12}
          icon="✅"
          color="purple"
        />
        <StatsCard
          title="예상 급여"
          value="₩6,19,000"
          subtitle="이번 달"
          change={8}
          icon="💰"
          color="orange"
        />
      </div>

      {/* 활동 및 차트 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 최근 활동 */}
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
        
        {/* 빠른 액션 */}
        <div>
          <QuickActions />
        </div>
      </div>

      {/* 프로젝트 진행 상황 */}
      <div>
        <ProjectProgress />
      </div>
    </div>
  )
}

// 통계 카드 컴포넌트
interface StatsCardProps {
  title: string
  value: string
  subtitle: string
  change?: number
  icon: string
  color: 'blue' | 'green' | 'purple' | 'orange'
}

function StatsCard({ title, value, subtitle, change, icon, color }: StatsCardProps) {
  const colorVariants = {
    blue: 'from-blue-400 to-blue-600',
    green: 'from-green-400 to-green-600',
    purple: 'from-purple-400 to-purple-600',
    orange: 'from-orange-400 to-orange-600'
  }

  return (
    <div className="group relative">
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${colorVariants[color]} rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300`}></div>
      
      <div className="relative backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              {title}
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-3 mb-1">
              {value}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              {subtitle}
            </p>
            {change && (
              <div className={`flex items-center text-sm font-medium ${
                change > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                <span className="mr-1">
                  {change > 0 ? '↗️' : '↘️'}
                </span>
                {Math.abs(change)}% 이번주 대비
              </div>
            )}
          </div>
          <div className={`w-16 h-16 bg-gradient-to-r ${colorVariants[color]} rounded-2xl flex items-center justify-center shadow-lg`}>
            <span className="text-2xl">{icon}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// 최근 활동 컴포넌트
function RecentActivity() {
  const activities = [
    { time: '10:30', action: '업무 시작', status: '완료', color: 'green' },
    { time: '14:15', action: '점심 휴식', status: '완료', color: 'blue' },
    { time: '16:45', action: '회의 참석', status: '진행중', color: 'orange' },
    { time: '18:00', action: '일일 보고서 작성', status: '예정', color: 'gray' },
  ]

  return (
    <div className="backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-xl">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">오늘의 활동</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
              <span className="text-sm font-bold text-gray-600 dark:text-gray-300">{activity.time}</span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-white">{activity.action}</p>
              <p className={`text-sm ${
                activity.status === '완료' ? 'text-green-600' :
                activity.status === '진행중' ? 'text-orange-600' : 'text-gray-500'
              }`}>
                {activity.status}
              </p>
            </div>
            <div className={`w-3 h-3 rounded-full ${
              activity.color === 'green' ? 'bg-green-500' :
              activity.color === 'orange' ? 'bg-orange-500' :
              activity.color === 'blue' ? 'bg-blue-500' : 'bg-gray-400'
            }`}></div>
          </div>
        ))}
      </div>
    </div>
  )
}

// 빠른 액션 컴포넌트
function QuickActions() {
  const actions = [
    { label: '업무 시작', icon: '▶️', color: 'from-green-500 to-green-600' },
    { label: '휴식 시작', icon: '⏸️', color: 'from-blue-500 to-blue-600' },
    { label: '보고서 작성', icon: '📝', color: 'from-purple-500 to-purple-600' },
    { label: '일정 확인', icon: '📅', color: 'from-orange-500 to-orange-600' },
  ]

  return (
    <div className="backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-xl">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">빠른 액션</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            className={`
              p-4 rounded-xl bg-gradient-to-r ${action.color}
              text-white font-medium text-sm
              hover:scale-105 active:scale-95
              transition-all duration-200
              shadow-lg hover:shadow-xl
            `}
          >
            <div className="text-2xl mb-2">{action.icon}</div>
            {action.label}
          </button>
        ))}
      </div>
    </div>
  )
}

// 프로젝트 진행 상황 컴포넌트
function ProjectProgress() {
  const projects = [
    { name: 'L사 모니터링 업무', progress: 75, color: 'blue' },
    { name: '쿠팡 야간 HUB', progress: 40, color: 'purple' },
    { name: '컬리 주간 OB', progress: 90, color: 'green' },
  ]

  return (
    <div className="backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-xl">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">프로젝트 진행 상황</h3>
      <div className="space-y-6">
        {projects.map((project, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-gray-900 dark:text-white">{project.name}</h4>
              <span className="text-sm font-bold text-gray-600 dark:text-gray-300">{project.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-1000 ease-out ${
                  project.color === 'blue' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                  project.color === 'purple' ? 'bg-gradient-to-r from-purple-500 to-purple-600' :
                  'bg-gradient-to-r from-green-500 to-green-600'
                }`}
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}