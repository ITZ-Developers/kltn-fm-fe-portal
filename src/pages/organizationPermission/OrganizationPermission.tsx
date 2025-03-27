import { ActionDeleteButton } from "../../components/form/Button";
import {
  configDeleteDialog,
  configModalForm,
  ConfirmationDialog,
  LoadingDialog,
} from "../../components/page/Dialog";
import {
  DECRYPT_FIELDS,
  PAGE_CONFIG,
} from "../../components/config/PageConfig";
import useApi from "../../hooks/useApi";
import { useGridView } from "../../hooks/useGridView";
import useModal from "../../hooks/useModal";
import {
  ALIGNMENT,
  BASIC_MESSAGES,
  ITEMS_PER_PAGE,
  PERMISSION_KIND,
} from "../../services/constant";
import Sidebar from "../../components/page/Sidebar";
import { CreateButton, ToolBar } from "../../components/page/ToolBar";
import { GridView } from "../../components/page/GridView";
import { useParams } from "react-router-dom";
import useQueryState from "../../hooks/useQueryState";
import { SelectBox } from "../../components/page/SelectBox";
import { useEffect, useState } from "react";
import { renderActionButton } from "../../components/config/ItemRender";
import { decryptData } from "../../services/utils";
import { useGlobalContext } from "../../components/config/GlobalProvider";
import CreateTransactionGroupPermission from "./CreateOrganizationPermission";

const OrganizationPermission = () => {
  const { setToast, sessionKey } = useGlobalContext();
  const { organizationId } = useParams();
  const initQuery = {
    organizationId,
    accountId: "",
    page: 0,
    size: ITEMS_PER_PAGE,
  };
  const { handleNavigateBack } = useQueryState({
    path: PAGE_CONFIG.ORGANIZATION.path,
  });
  const {
    isModalVisible: createFormVisible,
    showModal: showCreateForm,
    hideModal: hideCreateForm,
    formConfig: createFormConfig,
  } = useModal();
  const {
    isModalVisible: deleteDialogVisible,
    showModal: showDeleteDialog,
    hideModal: hideDeleteDialog,
    formConfig: deleteDialogConfig,
  } = useModal();
  const { organizationPermission: apiList, loading: loadingList } = useApi();
  const { employee, organization } = useApi();
  const { organizationPermission, loading } = useApi();
  const {
    data,
    query,
    setQuery,
    totalPages,
    handlePageChange,
    handleSubmitQuery,
  } = useGridView({
    fetchListApi: apiList.list,
    initQuery,
  });
  const [groupData, setGroupData] = useState<any>(null);

  useEffect(() => {
    if (!organizationId) {
      handleNavigateBack();
      return;
    }

    const fetchData = async () => {
      const res = await organization.get(organizationId);
      if (res.result) {
        const data = res.data;
        setGroupData(
          decryptData(sessionKey, data, DECRYPT_FIELDS.ORGANIZATION)
        );
      } else {
        handleNavigateBack();
      }
    };

    fetchData();
  }, [organizationId]);

  const columns = [
    {
      label: "Tên nhân viên",
      accessor: "account.fullName",
      align: ALIGNMENT.LEFT,
    },
    {
      label: "Tài khoản",
      accessor: "account.username",
      align: ALIGNMENT.LEFT,
    },
    {
      label: "Email",
      accessor: "account.email",
      align: ALIGNMENT.LEFT,
    },
    {
      label: "Phòng ban",
      accessor: "account.department.name",
      align: ALIGNMENT.LEFT,
    },
    renderActionButton({
      role: [PAGE_CONFIG.DELETE_ORGANIZATION_PERMISSION.role],
      renderChildren: (item: any) => (
        <>
          <ActionDeleteButton
            role={PAGE_CONFIG.DELETE_ORGANIZATION_PERMISSION.role}
            onClick={() => onDeleteButtonClick(item.id)}
          />
        </>
      ),
    }),
  ];

  const onDeleteButtonClick = (id: any) => {
    showDeleteDialog(
      configDeleteDialog({
        label: PAGE_CONFIG.DELETE_ORGANIZATION_PERMISSION.label,
        deleteApi: () => organizationPermission.del(id),
        refreshData: () => handleSubmitQuery(query),
        hideModal: hideDeleteDialog,
        setToast,
      })
    );
  };

  const onCreateButtonClick = () => {
    showCreateForm(
      configModalForm({
        label: PAGE_CONFIG.CREATE_ORGANIZATION_PERMISSION.label,
        fetchApi: organizationPermission.create,
        refreshData: () => handleSubmitQuery(query),
        hideModal: hideCreateForm,
        setToast,
        successMessage: BASIC_MESSAGES.CREATED,
        initForm: {
          accountId: "",
          organizationId,
        },
      })
    );
  };

  return (
    <Sidebar
      breadcrumbs={[
        {
          label: `${groupData?.name}`,
          onClick: handleNavigateBack,
        },
        {
          label: PAGE_CONFIG.ORGANIZATION_PERMISSION.label,
        },
      ]}
      activeItem={PAGE_CONFIG.ORGANIZATION.name}
      renderContent={
        <>
          <LoadingDialog isVisible={loading} />
          <ToolBar
            searchBoxes={
              <>
                <SelectBox
                  value={query.accountId}
                  onChange={(value: any) => {
                    setQuery({ ...query, accountId: value });
                  }}
                  fetchListApi={employee.autoComplete}
                  placeholder="Tên nhân viên..."
                  labelKey="fullName"
                />
              </>
            }
            onSearch={async () => await handleSubmitQuery(query)}
            onClear={async () => await handleSubmitQuery(initQuery)}
            actionButtons={
              <CreateButton
                role={PAGE_CONFIG.CREATE_ORGANIZATION_PERMISSION.role}
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
          <CreateTransactionGroupPermission
            isVisible={createFormVisible}
            formConfig={createFormConfig}
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
export default OrganizationPermission;
