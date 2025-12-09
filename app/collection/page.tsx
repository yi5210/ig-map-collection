"use client";

import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  Timestamp,
  deleteDoc,
  doc,
} from "firebase/firestore";

// -------------------------
// 1. 定義資料類型
// -------------------------
type CollectionItem = {
  id: string;
  url?: string;
  name: string;
  address?: string;
  category?: string;
  subCategory?: string;
  city?: string;
  note?: string;
  createdAt?: Timestamp | null;
};

export default function CollectionPage() {
  const [items, setItems] = useState<CollectionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("newest");

  const [region, setRegion] = useState("全部");
  const [selectedCities, setSelectedCities] = useState<string[]>([]);

  // -------------------------
  // 類別與子類別中文
  // -------------------------
  const categoryMap: Record<string, string> = {
    food: "食物",
    drinks: "飲料",
    cafe: "咖啡廳",
    attraction: "景點",
  };

  const subCategoryMap: Record<string, string> = {
    rice: "米食",
    noodle: "麵食",
    dessert: "甜點",
    hotpot: "火鍋",
  };

  // -------------------------
  // 地區 → 城市對照
  // -------------------------
  const regionMap: Record<string, string[]> = {
    全部: [],
    北部: ["台北", "新北", "桃園"],
    中部: ["台中", "彰化"],
    南部: ["台南", "高雄"],
  };

  // -------------------------
  // 2. 取得資料
  // -------------------------
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const q = query(
        collection(db, "collections"),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);

      const data: CollectionItem[] = snapshot.docs.map((docItem) => {
        const d = docItem.data();
        return {
          id: docItem.id,
          name: d.name || "無名稱",
          category: d.category || "",
          subCategory: d.subCategory || "",
          url: d.url || "",
          address: d.address || "",
          city: d.city || "",
          note: d.note || "",
          createdAt: d.createdAt || null,
        };
      });

      setItems(data);
    } catch (err) {
      console.error(err);
      setError("資料載入失敗，請檢查網路或 Firestore 設定。");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // -------------------------
  // 3. 刪除功能
  // -------------------------
  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("確定要刪除這筆收藏嗎？");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "collections", id));
      setItems((prev) => prev.filter((item) => item.id !== id));
      alert("✅ 刪除成功！");
    } catch (error) {
      console.error("刪除失敗：", error);
      alert("❌ 刪除失敗，請稍後再試。");
    }
  };

  // -------------------------
  // 城市複選切換
  // -------------------------
  const toggleCity = (city: string) => {
    setSelectedCities((prev) =>
      prev.includes(city)
        ? prev.filter((c) => c !== city)
        : [...prev, city]
    );
  };

  // -------------------------
  // 4. 過濾 + 排序
  // -------------------------
  const filteredItems = items
    .filter((item) => {
      const keyword = search.toLowerCase();

      // 搜尋（店名、地址、備註、分類）
      const matchText =
        item.name.toLowerCase().includes(keyword) ||
        item.address?.toLowerCase().includes(keyword) ||
        item.note?.toLowerCase().includes(keyword) ||
        categoryMap[item.category || ""]?.includes(keyword) ||
        subCategoryMap[item.subCategory || ""]?.includes(keyword);

      if (!matchText) return false;

      // 地區大分類（北、中、南）
      if (region !== "全部") {
        if (!regionMap[region].includes(item.city ?? "")) return false;
      }

      // 城市小分類（複選）
      if (selectedCities.length > 0) {
        if (!selectedCities.includes(item.city ?? "")) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortOption === "newest")
        return (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0);

      if (sortOption === "oldest")
        return (a.createdAt?.seconds ?? 0) - (b.createdAt?.seconds ?? 0);

      if (sortOption === "northToSouth") {
        const order = ["台北", "新北", "桃園", "台中", "彰化", "台南", "高雄"];
        return order.indexOf(a.city ?? "") - order.indexOf(b.city ?? "");
      }

      return 0;
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-6 md:py-8">
      <div className="max-w-3xl mx-auto px-4">
        
        {/* 主卡片 */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 space-y-6">
          
          {/* 回首頁按鈕 */}
          <div className="flex justify-start">
            <button
              onClick={() => window.location.href = '/'}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm md:text-base cursor-pointer font-medium"
            >
              ← 回首頁
            </button>
          </div>

          {/* 標題 */}
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              我的收藏庫
            </h1>
            <p className="text-gray-500 text-sm md:text-base">
              共 {filteredItems.length} 筆收藏
            </p>
          </div>

          {/* 搜尋列 */}
          <div className="relative">
            <input
              type="text"
              placeholder="🔍 搜尋店名、地址、備註..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          {/* 篩選區域 */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-4">
            {/* 排序 + 地區按鈕 */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
              {/* 排序 */}
              <div className="flex items-center gap-2">
                <span className="text-sm md:text-base text-gray-700 font-medium">排序：</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="border-2 border-gray-200 px-3 py-2 rounded-lg text-sm md:text-base flex-1 md:flex-initial cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-white"
                >
                  <option value="newest">最新 → 最舊</option>
                  <option value="oldest">最舊 → 最新</option>
                  <option value="northToSouth">從北到南</option>
                </select>
              </div>

              {/* 地區按鈕 */}
              <div className="flex gap-2 flex-wrap md:justify-end">
                {["全部", "北部", "中部", "南部"].map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setRegion(r);
                      setSelectedCities([]);
                    }}
                    className={`px-4 py-2 rounded-full text-sm md:text-base font-medium transition cursor-pointer ${
                      region === r 
                        ? "bg-blue-500 text-white shadow-md" 
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* 城市小分類按鈕（複選） */}
            {region !== "全部" && (
              <div className="flex gap-2 flex-wrap md:justify-end pt-2 border-t border-gray-200">
                {regionMap[region].map((c) => (
                  <button
                    key={c}
                    onClick={() => toggleCity(c)}
                    className={`px-4 py-2 rounded-full text-sm md:text-base font-medium transition cursor-pointer ${
                      selectedCities.includes(c)
                        ? "bg-green-500 text-white shadow-md"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-base md:text-lg text-gray-600">資料載入中...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-100 border-2 border-red-400 text-red-600 px-4 py-3 rounded-xl text-sm md:text-base">
              ⚠️ {error}
            </div>
          )}

          {/* 空畫面 */}
          {!isLoading && filteredItems.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-500 text-base md:text-lg">沒有符合條件的收藏</p>
            </div>
          )}

          {/* 列表 */}
          <ul className="space-y-4">
            {filteredItems.map((item) => {
              const isExpanded = expandedId === item.id;
              // 📍大頭針：搜尋店名+地址
              const mapQueryNameAddress = encodeURIComponent(
                `${item.name ?? ""} ${item.address ?? ""}`.trim()
              );
              const mapUrlNameAddress = `https://maps.google.com/?q=${mapQueryNameAddress}`;
              
              // 地址連結：只搜尋地址
              const mapUrlAddress = item.address
                ? `https://maps.google.com/?q=${encodeURIComponent(item.address)}`
                : "";

              return (
                <li
                  key={item.id}
                  className="relative p-5 border-2 border-gray-200 rounded-xl bg-gradient-to-r from-white to-gray-50 hover:shadow-lg transition cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                >
                  {/* 店名 */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="text-lg md:text-xl font-bold flex-1">
                      <span
                        className="text-blue-600 hover:text-blue-700 cursor-pointer hover:underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(mapUrlNameAddress, "_blank");
                        }}
                      >
                        📍 {item.name}
                      </span>
                    </div>

                    {/* 刪除按鈕 */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.id);
                      }}
                      className="px-3 py-1 text-sm bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition font-medium cursor-pointer"
                    >
                      刪除
                    </button>
                  </div>

                  {/* 展開內容 */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 text-sm md:text-base text-gray-700">
                      {item.category && (
                        <p className="flex items-center gap-2">
                          <span className="font-semibold text-gray-600">分類：</span>
                          <span>
                            {categoryMap[item.category] || item.category}
                            {item.subCategory && (
                              <> → {subCategoryMap[item.subCategory] || item.subCategory}</>
                            )}
                          </span>
                        </p>
                      )}

                      {item.url && (
                        <p className="flex items-start gap-2">
                          <span className="font-semibold text-gray-600 flex-shrink-0">IG：</span>
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-500 hover:text-indigo-700 underline break-all"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {item.url}
                          </a>
                        </p>
                      )}

                      {item.address && (
                        <p className="flex items-start gap-2">
                          <span className="font-semibold text-gray-600 flex-shrink-0">地址：</span>
                          <span
                            className="text-blue-600 hover:text-blue-700 cursor-pointer underline"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(mapUrlAddress, "_blank");
                            }}
                          >
                            {item.address}
                          </span>
                        </p>
                      )}

                      {item.city && (
                        <p className="flex items-center gap-2">
                          <span className="font-semibold text-gray-600">縣市：</span>
                          <span>{item.city}</span>
                        </p>
                      )}

                      {item.note && (
                        <p className="flex items-start gap-2">
                          <span className="font-semibold text-gray-600 flex-shrink-0">備註：</span>
                          <span className="text-gray-600">{item.note}</span>
                        </p>
                      )}
                    </div>
                  )}

                  {/* 展開提示 */}
                  {!isExpanded && (
                    <p className="mt-2 text-xs text-gray-400">點擊查看詳細資訊 ▼</p>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}