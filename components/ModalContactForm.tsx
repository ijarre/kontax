import React, { PropsWithChildren, ReactNode, useEffect } from "react";
import Modal from "./Modal";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import classNames from "classnames";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

type Props = {
  handleToggle: () => void;
  onSubmit: SubmitHandler<FormInitialValue>;
  isLoading?: boolean;
  defaultValue?: FormInitialValue;
  action: "create" | "edit";
};

const noSpecialCharacterRegex = /^[_A-z0-9]*((-|\s)*[_A-z0-9])*(\s)*$/;
const phoneNumberRegex = /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/;

const formSchema = z.object({
  first_name: z.string().regex(noSpecialCharacterRegex, "First name cannot include special character").min(1, { message: "First name is required" }),
  last_name: z.string().regex(noSpecialCharacterRegex, "Last name cannot include special character").optional(),
  phones: z.array(
    z.object({
      number: z.string().min(1, "Phone number cannot be empty").regex(phoneNumberRegex, "Invalid phone number"),
    })
  ),
});
export type FormInitialValue = z.infer<typeof formSchema>;

export function ModalContactForm({ handleToggle, onSubmit, isLoading, defaultValue, action }: Props) {
  const initialValue: FormInitialValue = defaultValue
    ? defaultValue
    : {
        first_name: "",
        phones: [{ number: "" }],
      };
  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormInitialValue>({
    defaultValues: initialValue,
    resolver: zodResolver(formSchema),
  });
  const { fields, append, remove } = useFieldArray({
    name: "phones",
    control,
  });

  useEffect(() => {
    if (action === "edit" && defaultValue) {
      setValue("first_name", defaultValue.first_name);
      setValue("last_name", defaultValue.last_name);
      setValue("phones", defaultValue.phones.length > 0 ? defaultValue.phones : [{ number: "" }]);
    }
  }, [defaultValue, action, setValue]);
  const inputStyle = classNames({
    "input input-bordered input-md w-full ": true,
  });

  return (
    <Modal isOpen={true} onClose={handleToggle} disableClickOutside={false}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3 className="font-bold text-lg">{`${action === "create" ? "Add" : "Edit"}`} Contact</h3>
        <div className="flex flex-col gap-2">
          <ContactInput inputComponent={<input {...register("first_name")} className={errors.first_name ? "input-error " + inputStyle : inputStyle} />} errorMessage={errors.first_name?.message} label="First name" />

          <ContactInput inputComponent={<input {...register("last_name")} className={errors.last_name ? "input-error " + inputStyle : inputStyle} />} errorMessage={errors.last_name?.message} label="Last name" />

          {fields.map((field, index) => {
            return (
              <ContactInput
                key={field.id}
                inputComponent={
                  <div className="flex gap-2 items-center" key={field.id}>
                    <input
                      {...register(`phones.${index}.number` as const, {
                        required: true,
                      })}
                      disabled={action === "edit"}
                      className={errors?.phones?.[index]?.number ? "input-error " + inputStyle : inputStyle}
                    />
                    <button
                      className="btn btn-sm btn-accent"
                      disabled={fields.length === 1 || action === "edit"}
                      onClick={(e) => {
                        e.preventDefault();
                        remove(index);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                }
                label={fields.length === 1 ? "Phone number" : `Phone number ${index + 1}`}
                errorMessage={errors.phones?.[index]?.number?.message}
              />
            );
          })}
          {action === "create" && (
            <button
              className="btn btn-sm"
              onClick={(e) => {
                e.preventDefault();
                append({ number: "" });
              }}
            >
              Add phone number
            </button>
          )}
        </div>
        <div className="modal-action">
          <button className="btn btn-secondary  w-full" type={"submit"} disabled={isLoading}>
            {isLoading ? <span className="loading loading-dots loading-md" /> : "Submit"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
type ContactInputProps = {
  inputComponent: ReactNode;
  label: string;
  errorMessage?: string;
};
const ContactInput = ({ inputComponent, errorMessage, label }: ContactInputProps) => {
  return (
    <div className="form-control w-full ">
      <label className="label ">
        <span className="label-text font-semibold">{label}</span>
      </label>
      {inputComponent}
      {errorMessage && (
        <label className="label pb-0">
          <span className="label-text-alt text-error">{errorMessage}</span>
        </label>
      )}
    </div>
  );
};
