import {
  ActionDeleteButton,
  ActionDoneButton,
  ActionEditButton,
  ActionRejectButton,
} from "../../components/form/Button";
import {
  configApproveDialog,
  configDeleteDialog,
  configRejectDialog,
  ConfirmationDialog,
  LoadingDialog,
} from "../../components/page/Dialog";
import {
  DECRYPT_FIELDS,
  PAGE_CONFIG,
} from "../../components/config/PageConfig";
import useApi from "../../hooks/useApi";
import useModal from "../../hooks/useModal";
import {
  ALIGNMENT,
  BASIC_MESSAGES,
  BUTTON_TEXT,
  ITEMS_PER_PAGE,
  TAG_KIND,
  TOAST,
  TRANSACTION_KIND_MAP,
  TRANSACTION_STATE_MAP,
} from "../../services/constant";
import Sidebar from "../../components/page/Sidebar";
import {
  CreateButton,
  ExportExcelButton,
  ToolBar,
} from "../../components/page/ToolBar";
import InputBox from "../../components/page/InputBox";
import { GridView } from "../../components/page/GridView";
import {
  basicRender,
  renderActionButton,
  renderEnum,
  renderIconField,
  renderMoneyField,
  renderTagField,
} from "../../components/config/ItemRender";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import useGridViewLocal from "../../hooks/useGridViewLocal";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  SelectBoxLazy,
  StaticSelectBox,
} from "../../components/page/SelectBox";
import { parseDate, truncateToDDMMYYYY } from "../../services/utils";
import DatePickerBox from "../../components/page/DatePickerBox";
import ImportExcelButton from "../../components/form/ImportExcelButton";

const initQuery = {
  name: "",
  kind: "",
  state: "",
  fromDate: "",
  toDate: "",
  transactionGroupId: "",
  tagId: "",
};

const Transaction = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const customFilterData = useCallback((allData: any[], query: any) => {
    return allData.filter((item) => {
      const nameFilter =
        !query?.name ||
        item.name.toLowerCase().includes(query.name.toLowerCase());
      const kindFilter = !query?.kind || item.kind == query.kind;
      const stateFilter = !query?.state || item.state == query.state;
      const transactionGroupIdFilter =
        !query?.transactionGroupId ||
        item?.transactionGroup?.id == query.transactionGroupId;
      const fromDate = parseDate(query?.fromDate);
      const toDate = parseDate(query?.toDate);
      const transactionDate = parseDate(item.transactionDate);
      const fromDateFilter =
        !fromDate || !transactionDate || fromDate >= transactionDate;
      const toDateFilter =
        !toDate || !transactionDate || toDate >= transactionDate;
      const tagIdFilter = !query?.tagId || item?.tag?.id == query.tagId;
      return (
        nameFilter &&
        stateFilter &&
        tagIdFilter &&
        kindFilter &&
        transactionGroupIdFilter &&
        fromDateFilter &&
        toDateFilter
      );
    });
  }, []);
  const { setToast, sessionKey } = useGlobalContext();
  const {
    isModalVisible: deleteDialogVisible,
    showModal: showDeleteDialog,
    hideModal: hideDeleteDialog,
    formConfig: deleteDialogConfig,
  } = useModal();
  const { transaction: apiList, loading: loadingList } = useApi();
  const [totalStats, setTotalStats] = useState<any>({ income: 0, expense: 0 });
  const { transaction, loading } = useApi();
  const { transactionGroup, tag } = useApi();
  const {
    data,
    query,
    allData,
    totalPages,
    handlePageChange,
    handleSubmitQuery,
    handleDeleteItem,
    handleRefreshData,
  } = useGridViewLocal({
    initQuery: state?.query || initQuery,
    filterData: customFilterData,
    decryptFields: DECRYPT_FIELDS.TRANSACTION,
    secretKey: sessionKey,
    fetchListApi: apiList.list,
    queryParams: { ignorePaymentPeriod: 1, sortDate: 4 },
  });

  useEffect(() => {
    if (!allData || !Array.isArray(allData)) return;

    const stats = allData.reduce(
      (acc, item) => {
        if (item.kind == TRANSACTION_KIND_MAP.INCOME.value)
          acc.income += parseFloat(item.money) || 0;
        if (item.kind == TRANSACTION_KIND_MAP.EXPENSE.value)
          acc.expense += parseFloat(item.money) || 0;
        return acc;
      },
      { income: 0, expense: 0 }
    );

    setTotalStats(stats);
  }, [allData]);

  const columns = [
    {
      label: "Ngày giao dịch",
      accessor: "transactionDate",
      align: ALIGNMENT.LEFT,
      render: (item: any) => {
        return basicRender({
          align: ALIGNMENT.LEFT,
          content: truncateToDDMMYYYY(item.transactionDate),
        });
      },
    },
    renderIconField({
      label: "Tên giao dịch",
      accessor: "name",
      iconMapField: "kind",
      dataMap: TRANSACTION_KIND_MAP,
      role: PAGE_CONFIG.VIEW_TRANSACTION.role,
      onClick: (item: any) => onViewClick(item.id),
    }),
    renderMoneyField({
      label: "Số tiền",
      accessor: "money",
      align: ALIGNMENT.RIGHT,
    }),
    {
      label: "Danh mục",
      accessor: "category.name",
      align: ALIGNMENT.LEFT,
    },
    renderTagField({
      label: "Nhóm giao dịch",
      accessor: "transactionGroup.name",
      align: ALIGNMENT.LEFT,
      colorCodeField: "tag.colorCode",
    }),
    renderEnum({
      label: "Tình trạng",
      accessor: "state",
      dataMap: TRANSACTION_STATE_MAP,
    }),
    renderActionButton({
      align: ALIGNMENT.RIGHT,
      role: [
        PAGE_CONFIG.DELETE_TRANSACTION.role,
        PAGE_CONFIG.UPDATE_TRANSACTION.role,
        PAGE_CONFIG.APPROVE_TRANSACTION.role,
        PAGE_CONFIG.REJECT_TRANSACTION.role,
      ],
      renderChildren: (item: any) => (
        <>
          {item.state != TRANSACTION_STATE_MAP.PAID.value && (
            <>
              {item.state != TRANSACTION_STATE_MAP.APPROVE.value && (
                <ActionDoneButton
                  text={BUTTON_TEXT.APPROVE}
                  role={PAGE_CONFIG.APPROVE_TRANSACTION.role}
                  onClick={() => onApproveButtonClick(item.id)}
                />
              )}
              <ActionRejectButton
                role={PAGE_CONFIG.REJECT_TRANSACTION.role}
                onClick={() => onRejectButtonClick(item.id)}
              />
              <ActionEditButton
                role={PAGE_CONFIG.UPDATE_TRANSACTION.role}
                onClick={() => onUpdateButtonClick(item.id)}
              />
              <ActionDeleteButton
                role={PAGE_CONFIG.DELETE_TRANSACTION.role}
                onClick={() => onDeleteButtonClick(item.id)}
              />
            </>
          )}
        </>
      ),
    }),
  ];

  const onApproveButtonClick = (id: any) => {
    showDeleteDialog(
      configApproveDialog({
        label: PAGE_CONFIG.APPROVE_TRANSACTION.label,
        fetchApi: () => transaction.approve(id),
        refreshData: handleRefreshData,
        hideModal: hideDeleteDialog,
        setToast,
      })
    );
  };

  const onRejectButtonClick = (id: any) => {
    showDeleteDialog(
      configRejectDialog({
        label: PAGE_CONFIG.REJECT_TRANSACTION.label,
        fetchApi: () => transaction.reject(id),
        refreshData: handleRefreshData,
        hideModal: hideDeleteDialog,
        setToast,
      })
    );
  };

  const onDeleteButtonClick = (id: any) => {
    showDeleteDialog(
      configDeleteDialog({
        label: PAGE_CONFIG.DELETE_TRANSACTION.label,
        deleteApi: () => transaction.del(id),
        refreshData: () => handleDeleteItem(id),
        hideModal: hideDeleteDialog,
        setToast,
      })
    );
  };

  const onCreateButtonClick = () => {
    navigate(PAGE_CONFIG.CREATE_TRANSACTION.path, { state: { query } });
  };

  const onUpdateButtonClick = (id: any) => {
    navigate(`/transaction/update/${id}`, { state: { query } });
  };

  const onViewClick = (id: any) => {
    navigate(`/transaction/view/${id}`, { state: { query } });
  };

  const onExportExcelButtonClick = async () => {
    if (!data.length) {
      setToast(BASIC_MESSAGES.NO_DATA, TOAST.WARN);
      return;
    }
    const ids = data.map((item: any) => item.id);
    const res = await transaction.exportToExcel(ids, query.kind);
    if (res.result) {
      setToast(BASIC_MESSAGES.EXPORTED, TOAST.SUCCESS);
    } else {
      setToast(BASIC_MESSAGES.FAILED, TOAST.ERROR);
    }
  };

  return (
    <Sidebar
      breadcrumbs={[
        {
          label: PAGE_CONFIG.TRANSACTION.label,
        },
      ]}
      activeItem={PAGE_CONFIG.TRANSACTION.name}
      renderContent={
        <>
          <LoadingDialog isVisible={loading} />
          <ToolBar
            searchBoxes={
              <>
                <InputBox
                  value={query.name}
                  onChangeText={(value: any) =>
                    handleSubmitQuery({ ...query, name: value })
                  }
                  placeholder="Tên giao dịch..."
                />
                <StaticSelectBox
                  value={query.kind}
                  onChange={(value: any) => {
                    handleSubmitQuery({ ...query, kind: value });
                  }}
                  dataMap={TRANSACTION_KIND_MAP}
                  placeholder="Loại..."
                />
                <StaticSelectBox
                  value={query.state}
                  onChange={(value: any) => {
                    handleSubmitQuery({ ...query, state: value });
                  }}
                  dataMap={TRANSACTION_STATE_MAP}
                  placeholder="Tình trạng..."
                />
                <SelectBoxLazy
                  value={query.transactionGroupId}
                  onChange={(value: any) => {
                    handleSubmitQuery({
                      ...query,
                      transactionGroupId: value,
                    });
                  }}
                  fetchListApi={transactionGroup.autoComplete}
                  placeholder="Nhóm giao dịch..."
                  decryptFields={DECRYPT_FIELDS.TRANSACTION_GROUP}
                />
                <DatePickerBox
                  value={query.fromDate}
                  onChange={(value: any) =>
                    handleSubmitQuery({
                      ...query,
                      fromDate: value,
                    })
                  }
                  placeholder="Từ ngày..."
                />
                <DatePickerBox
                  value={query.toDate}
                  onChange={(value: any) =>
                    handleSubmitQuery({
                      ...query,
                      toDate: value,
                    })
                  }
                  placeholder="Đến ngày..."
                />
                <SelectBoxLazy
                  value={query.tagId}
                  onChange={(value: any) => {
                    handleSubmitQuery({ ...query, tagId: value });
                  }}
                  fetchListApi={tag.autoComplete}
                  queryParams={{ kind: TAG_KIND.TRANSACTION }}
                  placeholder="Thẻ..."
                  colorCodeField="colorCode"
                  decryptFields={DECRYPT_FIELDS.TAG}
                />
              </>
            }
            onClear={() => handleSubmitQuery(initQuery)}
            onRefresh={handleRefreshData}
            actionButtons2={
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <div className="flex items-center gap-2 bg-green-100 text-green-700 text-sm p-2 rounded-lg shadow-md">
                    <span className="font-semibold">Tổng thu:</span>
                    <span className="font-bold">
                      {totalStats.income.toLocaleString()} đ
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-red-100 text-red-700 text-sm p-2 rounded-lg shadow-md">
                    <span className="font-semibold">Tổng chi:</span>
                    <span className="font-bold">
                      {totalStats.expense.toLocaleString()} đ
                    </span>
                  </div>
                </div>
                <div className="flex flex-row space-x-2">
                  <ImportExcelButton
                    role={PAGE_CONFIG.IMPORT_EXCEL_TRANSACTION.role}
                    fetchApi={transaction.importExcel}
                    onFileUploaded={handleRefreshData}
                  />
                  <ExportExcelButton
                    role={PAGE_CONFIG.EXPORT_EXCEL_TRANSACTION.role}
                    onClick={onExportExcelButtonClick}
                  />
                  <CreateButton
                    role={PAGE_CONFIG.CREATE_TRANSACTION.role}
                    onClick={onCreateButtonClick}
                  />
                </div>
              </div>
            }
          />
          <GridView
            isLoading={loadingList}
            data={data}
            columns={columns}
            currentPage={query.page}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
            totalPages={totalPages}
          />
          <ConfirmationDialog
            isVisible={deleteDialogVisible}
            formConfig={deleteDialogConfig}
          />
        </>
      }
    ></Sidebar>
  );
};
export default Transaction;
