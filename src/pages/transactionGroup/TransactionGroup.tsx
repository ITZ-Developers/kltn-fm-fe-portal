import {
  ActionDeleteButton,
  ActionEditButton,
} from "../../components/form/Button";
import {
  configDeleteDialog,
  configModalForm,
  ConfirmationDialog,
  LoadingDialog,
} from "../../components/page/Dialog";
import { DECRYPT_FIELDS, PAGE_CONFIG } from "../../components/PageConfig";
import useApi from "../../hooks/useApi";
import useModal from "../../hooks/useModal";
import {
  ALIGNMENT,
  BASIC_MESSAGES,
  ITEMS_PER_PAGE,
  TRUNCATE_LENGTH,
} from "../../services/constant";
import Sidebar from "../../components/page/Sidebar";
import { CreateButton, ToolBar } from "../../components/page/ToolBar";
import InputBox from "../../components/page/InputBox";
import { GridView } from "../../components/page/GridView";
import { basicRender, renderActionButton } from "../../components/ItemRender";
import { decrypt, truncateString } from "../../services/utils";
import { useGlobalContext } from "../../components/GlobalProvider";
import CreateTransactionGroup from "./CreateTransactionGroup";
import UpdateTransactionGroup from "./UpdateTransactionGroup";
import useGridViewLocal from "../../hooks/useGridViewLocal";
import { useCallback, useEffect } from "react";

const initQuery = { name: "" };

const TransactionGroup = () => {
  const customFilterData = useCallback((allData: any[], query: any) => {
    return allData.filter((item) => {
      return (
        !query?.name ||
        item.name.toLowerCase().includes(query.name.toLowerCase())
      );
    });
  }, []);
  const { setToast, sessionKey } = useGlobalContext();
  const {
    isModalVisible: createFormVisible,
    showModal: showCreateForm,
    hideModal: hideCreateForm,
    formConfig: createFormConfig,
  } = useModal();
  const {
    isModalVisible: updateFormVisible,
    showModal: showUpdateForm,
    hideModal: hideUpdateForm,
    formConfig: updateFormConfig,
  } = useModal();
  const {
    isModalVisible: deleteDialogVisible,
    showModal: showDeleteDialog,
    hideModal: hideDeleteDialog,
    formConfig: deleteDialogConfig,
  } = useModal();
  const { transactionGroup: apiList, loading: loadingList } = useApi();
  const { transactionGroup, loading } = useApi();
  const {
    data,
    query,
    totalPages,
    handlePageChange,
    handleSubmitQuery,
    updateData,
    deleteItem,
  } = useGridViewLocal({
    initQuery,
    filterData: customFilterData,
    decryptFields: DECRYPT_FIELDS.TRANSACTION_GROUP,
    secretKey: sessionKey,
  });

  useEffect(() => {
    if (!sessionKey) {
      return;
    }
    handleRefresh();
  }, [sessionKey]);

  const columns = [
    {
      label: "Tên nhóm",
      accessor: "name",
      align: ALIGNMENT.LEFT,
    },
    {
      label: "Mô tả",
      accessor: "description",
      align: ALIGNMENT.LEFT,
      render: (item: any) => {
        return basicRender({
          align: ALIGNMENT.LEFT,
          content: truncateString(item.description, TRUNCATE_LENGTH),
        });
      },
    },
    renderActionButton({
      role: [
        PAGE_CONFIG.CREATE_TRANSACTION_GROUP.role,
        PAGE_CONFIG.UPDATE_TRANSACTION_GROUP.role,
      ],
      renderChildren: (item: any) => (
        <>
          <ActionEditButton
            role={PAGE_CONFIG.UPDATE_TRANSACTION_GROUP.role}
            onClick={() => onUpdateButtonClick(item.id)}
          />
          <ActionDeleteButton
            role={PAGE_CONFIG.DELETE_TRANSACTION_GROUP.role}
            onClick={() => onDeleteButtonClick(item.id)}
          />
        </>
      ),
    }),
  ];

  const handleRefresh = async () => {
    const res = await apiList.list({ isPaged: 0 });
    if (res.result) {
      const data = res.data;
      updateData(data.content);
    } else {
      updateData([]);
    }
  };

  const onDeleteButtonClick = (id: any) => {
    showDeleteDialog(
      configDeleteDialog({
        label: PAGE_CONFIG.DELETE_TRANSACTION_GROUP.label,
        deleteApi: () => transactionGroup.del(id),
        refreshData: () => deleteItem(id),
        hideModal: hideDeleteDialog,
        setToast,
      })
    );
  };

  const onCreateButtonClick = () => {
    showCreateForm(
      configModalForm({
        label: PAGE_CONFIG.CREATE_TRANSACTION_GROUP.label,
        fetchApi: transactionGroup.create,
        refreshData: handleRefresh,
        hideModal: hideCreateForm,
        setToast,
        successMessage: BASIC_MESSAGES.CREATED,
        initForm: {
          name: "",
          description: "",
        },
      })
    );
  };

  const onUpdateButtonClick = (id: any) => {
    showUpdateForm(
      configModalForm({
        label: PAGE_CONFIG.UPDATE_TRANSACTION_GROUP.label,
        fetchApi: transactionGroup.update,
        refreshData: handleRefresh,
        hideModal: hideUpdateForm,
        setToast,
        successMessage: BASIC_MESSAGES.UPDATED,
        initForm: {
          id,
          name: "",
          description: "",
        },
      })
    );
  };

  return (
    <Sidebar
      breadcrumbs={[
        {
          label: PAGE_CONFIG.TRANSACTION_GROUP.label,
        },
      ]}
      activeItem={PAGE_CONFIG.TRANSACTION_GROUP.name}
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
                  placeholder="Tên nhóm..."
                />
              </>
            }
            onClear={() => handleSubmitQuery(initQuery)}
            onRefresh={handleRefresh}
            actionButtons={
              <CreateButton
                role={PAGE_CONFIG.CREATE_TRANSACTION_GROUP.role}
                onClick={onCreateButtonClick}
              />
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
          <CreateTransactionGroup
            isVisible={createFormVisible}
            formConfig={createFormConfig}
          />
          <UpdateTransactionGroup
            isVisible={updateFormVisible}
            formConfig={updateFormConfig}
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
export default TransactionGroup;
