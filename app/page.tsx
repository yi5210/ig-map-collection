import Header from './components/Header';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <Header />

        {/* 主要內容 */}
        <main className="mt-12 md:mt-16">
          {/* 標題區塊 */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              歡迎使用收藏系統
            </h1>
            <p className="text-lg md:text-xl text-gray-600">
              輕鬆收藏你的美食探索，隨時查看想去的店家
            </p>
          </div>

          {/* 功能卡片區 */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* 新增卡片 */}
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 hover:shadow-xl transition transform hover:-translate-y-1">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">
                新增收藏
              </h3>
              <p className="text-gray-600 mb-4">
                發現了有趣的店家或美食？立即新增到你的收藏庫，保存 IG Reels 連結和店家資訊。
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• 儲存 IG Reels 連結</li>
                <li>• 記錄店名與地址</li>
                <li>• 分類管理更方便</li>
              </ul>
            </div>

            {/* 收藏庫卡片 */}
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 hover:shadow-xl transition transform hover:-translate-y-1">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">
                收藏庫
              </h3>
              <p className="text-gray-600 mb-4">
                瀏覽所有收藏的店家，使用篩選功能快速找到想去的地方，一鍵導航到 Google Maps。
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• 依地區篩選店家</li>
                <li>• 搜尋店名或地址</li>
                <li>• 快速開啟地圖導航</li>
              </ul>
            </div>
          </div>

          {/* 使用說明 */}
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
            <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 text-center">
              使用步驟
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">點擊【新增】按鈕</h4>
                  <p className="text-gray-600 text-sm">填寫店家資訊並儲存到你的收藏庫</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">前往【收藏庫】查看</h4>
                  <p className="text-gray-600 text-sm">使用篩選和搜尋功能找到想要的店家</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">點擊店名開啟地圖</h4>
                  <p className="text-gray-600 text-sm">直接導航到 Google Maps 規劃你的美食之旅</p>
                </div>
              </div>
            </div>
          </div>

          {/* 底部提示 */}
          <div className="mt-8 text-center text-gray-500 text-sm">
            💡 提示：所有收藏都會自動儲存，隨時都能查看
          </div>
        </main>
      </div>
    </div>
  );
}