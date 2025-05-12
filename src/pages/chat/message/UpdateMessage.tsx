import { useEffect } from "react";
import { useGlobalContext } from "../../../components/config/GlobalProvider";
import useApi from "../../../hooks/useApi";
import useForm from "../../../hooks/useForm";
import { BASIC_MESSAGES, BUTTON_TEXT, TOAST } from "../../../services/constant";
import { LoadingDialog } from "../../../components/page/Dialog";
import { ActionSection, ModalForm } from "../../../components/form/FormCard";
import { TextAreaField } from "../../../components/form/InputField";
import { CancelButton, SubmitButton } from "../../../components/form/Button";
import DocumentsField from "../../../components/form/DocumentsField";
import { decryptData, encryptAES } from "../../../services/utils";
import { DECRYPT_FIELDS } from "../../../components/config/PageConfig";

const UpdateMessage = ({ isVisible, formConfig }: any) => {
  const { setToast, sessionKey } = useGlobalContext();
  const { chatMessage, loading } = useApi();
  const validate = (form: any) => {
    const newErrors: any = {};
    if (!form.content.trim()) {
      newErrors.content = "Nội dung không hợp lệ";
    }
    return newErrors;
  };

  const { form, errors, setForm, resetForm, handleChange, isValidForm } =
    useForm(formConfig.initForm, validate);

  useEffect(() => {
    const fetchData = async () => {
      resetForm();
      const res = await chatMessage.get(formConfig.initForm.id);
      if (res.result) {
        const data = decryptData(sessionKey, res.data, DECRYPT_FIELDS.MESSAGE);
        setForm({
          id: data.id,
          content: data.content,
          document: data.document,
        });
      } else {
        formConfig?.hideModal();
      }
    };

    if (formConfig?.initForm?.id) {
      fetchData();
    }
  }, [formConfig]);

  useEffect(() => {
    resetForm();
  }, [isVisible]);

  const handleSubmit = async () => {
    if (isValidForm()) {
      await formConfig.onButtonClick({
        id: form.id,
        content: encryptAES(form.content, sessionKey),
        document: encryptAES(form.document, sessionKey),
      });
    } else {
      setToast(BASIC_MESSAGES.INVALID_FORM, TOAST.ERROR);
    }
  };

  if (!isVisible) return null;
  return (
    <>
      <LoadingDialog isVisible={loading} />
      <ModalForm
        isVisible={isVisible}
        onClose={formConfig.hideModal}
        title={formConfig.title}
        children={
          <>
            <div className="flex flex-col space-y-4">
              <TextAreaField
                title="Nội dung"
                isRequired={true}
                placeholder="Nhập nội dung"
                value={form?.content}
                onChangeText={(value: any) => handleChange("content", value)}
                error={errors?.content}
              />
              <DocumentsField
                title="Tệp đính kèm"
                value={form?.document}
                onChange={(value: any) => handleChange("document", value)}
              />
              <ActionSection
                children={
                  <>
                    <CancelButton onClick={formConfig?.hideModal} />
                    <SubmitButton
                      text={BUTTON_TEXT.UPDATE}
                      onClick={handleSubmit}
                    />
                  </>
                }
              />
            </div>
          </>
        }
      />
    </>
  );
};

export default UpdateMessage;
