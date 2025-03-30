import {
  ActionDeleteButton,
  ActionEditButton,
} from "../../components/form/Button";
import {
  configDeleteDialog,
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
  ITEMS_PER_PAGE,
  TAG_KIND,
  TRANSACTION_KIND_MAP,
  TRANSACTION_STATE_MAP,
} from "../../services/constant";
import Sidebar from "../../components/page/Sidebar";
import { CreateButton, ToolBar } from "../../components/page/ToolBar";
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
import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  SelectBoxLazy,
  StaticSelectBox,
} from "../../components/page/SelectBox";
import { parseDate, truncateToDDMMYYYY } from "../../services/utils";
import DatePickerBox from "../../components/page/DatePickerBox";

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
  const { transaction, loading } = useApi();
  const { transactionGroup, tag } = useApi();
  const {
    data,
    query,
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

  const columns = [
    {
      label: "Ngày",
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
      role: [
        PAGE_CONFIG.DELETE_TRANSACTION.role,
        PAGE_CONFIG.UPDATE_TRANSACTION.role,
      ],
      renderChildren: (item: any) => (
        <>
          <ActionEditButton
            role={PAGE_CONFIG.UPDATE_TRANSACTION.role}
            onClick={() => onUpdateButtonClick(item.id)}
          />
          <ActionDeleteButton
            role={PAGE_CONFIG.DELETE_TRANSACTION.role}
            onClick={() => onDeleteButtonClick(item.id)}
          />
        </>
      ),
    }),
  ];

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
              <div className="flex justify-end">
                <CreateButton
                  role={PAGE_CONFIG.CREATE_TRANSACTION.role}
                  onClick={onCreateButtonClick}
                />
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
