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
      alert("刪除成功！");
    } catch (error) {
      console.error("刪除失敗：", error);
      alert("刪除失敗，請稍後再試。");
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
    <div className="max-w-xl mx-auto p-4 md:p-6 space-y-4 md:space-y-6">
      {/* 回首頁按鈕 */}
      <div className="flex justify-start">
        <button
          onClick={() => window.location.href = '/'}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition text-sm md:text-base cursor-pointer"
        >
          回首頁
        </button>
      </div>

      {/* 標題 */}
      <h1 className="text-2xl md:text-3xl font-bold text-center">我的收藏庫</h1>

      {/* 搜尋列 */}
      <input
        type="text"
        placeholder="搜尋店名、地址、備註..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg text-sm md:text-base"
      />

      {/* 排序 + 地區按鈕 + 城市按鈕 */}
      <div className="space-y-3">
        {/* 排序 + 地區按鈕 */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
          {/* 排序 */}
          <div className="flex items-center gap-2">
            <span className="text-sm md:text-base text-gray-700">排序：</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border px-3 py-2 rounded-lg text-sm md:text-base flex-1 md:flex-initial"
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
                className={`px-3 py-1 rounded-full border text-sm md:text-base ${
                  region === r ? "bg-blue-500 text-white" : "bg-white"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* 城市小分類按鈕（複選） */}
        {region !== "全部" && (
          <div className="flex gap-2 flex-wrap md:justify-end">
            {regionMap[region].map((c) => (
              <button
                key={c}
                onClick={() => toggleCity(c)}
                className={`px-3 py-1 rounded-full border text-sm md:text-base cursor-pointer ${
                  selectedCities.includes(c)
                    ? "bg-green-500 text-white"
                    : "bg-white"
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
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2 text-sm md:text-base text-gray-600">資料載入中...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-600 px-4 py-3 rounded text-sm md:text-base">
          {error}
        </div>
      )}

      {/* 空畫面 */}
      {!isLoading && filteredItems.length === 0 && (
        <p className="text-center text-gray-500 py-8 text-sm md:text-base">沒有符合條件的收藏。</p>
      )}

      {/* 列表 */}
      <ul className="space-y-4">
        {filteredItems.map((item) => {
          const isExpanded = expandedId === item.id;
          const mapQuery = encodeURIComponent(
            `${item.name ?? ""} ${item.address ?? ""} ${item.city ?? ""}`
          );
          const mapUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

          return (
            <li
              key={item.id}
              className="relative p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition"
              onClick={() => setExpandedId(isExpanded ? null : item.id)}
            >
              <h2
                className="text-lg md:text-xl font-semibold text-blue-600 hover:underline cursor-pointer inline-block pr-16"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(mapUrl, "_blank");
                }}
              >
                {item.name}
              </h2>

              {/* 展開內容 */}
              {isExpanded && (
                <div className="mt-2 space-y-1 text-sm md:text-base text-gray-700">
                  <p>
                    分類:{" "}
                    {item.category
                      ? categoryMap[item.category] || item.category
                      : ""}
                    {item.subCategory
                      ? ` > ${
                          subCategoryMap[item.subCategory] ||
                          item.subCategory
                        }`
                      : ""}
                  </p>

                  {item.url && (
                    <p className="break-all">
                      IG URL:{" "}
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-500 hover:text-indigo-700"
                      >
                        {item.url}
                      </a>
                    </p>
                  )}

                  {item.address && (
                    <p>
                      地址:{" "}
                      <span
                        className="text-blue-600 hover:underline cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(mapUrl, "_blank");
                        }}
                      >
                        {item.address}
                      </span>
                    </p>
                  )}

                  {item.city && <p>縣市: {item.city}</p>}

                  {item.note && <p>備註: {item.note}</p>}
                </div>
              )}

              {/* 刪除按鈕 */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(item.id);
                }}
                className="absolute right-4 top-4 text-sm md:text-base text-red-400 hover:text-red-600"
              >
                刪除
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}