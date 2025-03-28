import { useEffect, useState } from "react";
import { ITEMS_PER_PAGE, TOAST } from "../services/constant";
import { decryptData } from "../services/utils";
import { useGlobalContext } from "../components/config/GlobalProvider";

const useGridViewLocal = ({
  fetchListApi,
  initQuery = {},
  filterData = (data: any[]) => data,
  decryptFields,
  secretKey,
  queryParams,
}: any) => {
  const { sessionKey, setToast } = useGlobalContext();
  const [allData, setAllData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [query, setQuery] = useState({
    page: 0,
    size: ITEMS_PER_PAGE,
    ...initQuery,
  });

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  useEffect(() => {
    handleRefreshData();
  }, [sessionKey]);

  useEffect(() => {
    const filtered = filterData(allData, query);
    const newTotalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const startIndex = query.page * ITEMS_PER_PAGE;
    const paginatedData = filtered.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );

    if (query.page >= newTotalPages && newTotalPages > 0) {
      setQuery((prev: any) => ({ ...prev, page: newTotalPages - 1 }));
    } else if (query.page < 0) {
      setQuery((prev: any) => ({ ...prev, page: 0 }));
    }

    setFilteredData(filtered);
    setData(paginatedData);
  }, [query, allData, filterData]);

  const [data, setData] = useState(() => {
    const filtered = filterData(allData, query);
    const startIndex = query.page * ITEMS_PER_PAGE;
    return filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  });

  const handlePageChange = (page: number) => {
    setQuery((prev: any) => ({
      ...prev,
      page: Math.max(0, Math.min(page, totalPages - 1)),
    }));
  };

  const handleSubmitQuery = (newQuery: any) => {
    setQuery((prev: any) => ({
      ...prev,
      ...newQuery,
      page: 0,
    }));
  };

  const handleDeleteItem = (itemId: any) => {
    setAllData((prevData) => {
      const newData = prevData.filter((item) => item.id !== itemId);
      return newData;
    });
  };

  const handleRefreshData = async () => {
    if (!sessionKey) {
      updateData([]);
      return;
    }
    const res = await fetchListApi({ isPaged: 0, ...queryParams });
    if (res.result) {
      const data = res.data;
      updateData(data?.content || []);
    } else {
      setToast(res.message, TOAST.ERROR);
      updateData([]);
    }
  };

  const updateData = (newData: any[]) => {
    setAllData(
      newData?.map((item) => decryptData(secretKey, item, decryptFields))
    );
  };

  return {
    data,
    totalPages,
    query,
    setQuery,
    handlePageChange,
    handleSubmitQuery,
    handleDeleteItem,
    handleRefreshData,
  };
};

export default useGridViewLocal;
