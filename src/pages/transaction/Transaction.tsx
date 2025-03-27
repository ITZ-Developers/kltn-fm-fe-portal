import { GridView } from "../../components/page/GridView";
import Sidebar from "../../components/page/Sidebar";
import useApi from "../../hooks/useApi";
import { PAGE_CONFIG } from "../../components/config/PageConfig";
import { CreateButton, ToolBar } from "../../components/page/ToolBar";
import InputBox from "../../components/page/InputBox";
import { useLocation, useNavigate } from "react-router-dom";
import { ALIGNMENT, ITEMS_PER_PAGE, STATUS_MAP } from "../../services/constant";
import { useGridView } from "../../hooks/useGridView";
import { ConfirmationDialog } from "../../components/page/Dialog";
import useModal from "../../hooks/useModal";
import { StaticSelectBox } from "../../components/page/SelectBox";

const initQuery = {
  page: 0,
  size: ITEMS_PER_PAGE,
};

const Transaction = () => {
  const { state } = useLocation();
  const { isModalVisible, showModal, hideModal, formConfig } = useModal();
  const navigate = useNavigate();
  const { transaction, loading } = useApi();
  const {
    data,
    query,
    setQuery,
    totalPages,
    handlePageChange,
    handleSubmitQuery,
  } = useGridView({
    fetchListApi: transaction.list,
    initQuery: state?.query || initQuery,
  });

  const columns = [
    {
      label: "Tên",
      accessor: "name",
      align: ALIGNMENT.LEFT,
    },
  ];

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
          {/* <LoadingDialog isVisible={loading} /> */}
          <ToolBar
            searchBoxes={
              <>
                <InputBox
                  value={query.fullName}
                  onChangeText={(value: any) =>
                    setQuery({ ...query, fullName: value })
                  }
                  placeholder="Họ và tên..."
                />
                {/* <SelectBox
                  value={query.groupId}
                  onChange={(value: any) => {
                    setQuery({ ...query, groupId: value });
                  }}
                  queryParams={{
                    kind: GROUP_KIND_MAP.ADMIN.value,
                  }}
                  fetchListApi={role.list}
                  placeholder="Vai trò..."
                /> */}
                <StaticSelectBox
                  value={query.status}
                  onChange={(value: any) => {
                    setQuery({ ...query, status: value });
                  }}
                  dataMap={STATUS_MAP}
                  placeholder="Trạng thái..."
                />
              </>
            }
            onClear={async () => await handleSubmitQuery(initQuery)}
            onRefresh={async () => await handleSubmitQuery(query)}
            actionButtons={
              <CreateButton
                role={PAGE_CONFIG.CREATE_TRANSACTION.role}
                onClick={() =>
                  navigate(PAGE_CONFIG.CREATE_TRANSACTION.path, {
                    state: { query },
                  })
                }
              />
            }
          />
          <GridView
            isLoading={loading}
            data={data}
            columns={columns}
            currentPage={query.page}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
            totalPages={totalPages}
          />
          <ConfirmationDialog
            isVisible={isModalVisible}
            formConfig={formConfig}
          />
        </>
      }
    ></Sidebar>
  );
};

export default Transaction;
