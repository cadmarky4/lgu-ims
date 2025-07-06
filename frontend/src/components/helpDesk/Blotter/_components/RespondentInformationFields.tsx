import { FormField } from "@/components/_global/components/FormField";
import {
  type CreateBlotter,
  type BlotterInvolvement,
  blotterInvolvementOptions,
} from "@/services/helpDesk/blotters/blotters.types";
import { User, X } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FiPlus } from "react-icons/fi";
import { enumToTitleCase } from "../../utilities/enumToTitleCase";

export const RespondentInformationFields: React.FC = () => {
  const { t } = useTranslation();

  const {
    control,
    // formState: { errors },
  } = useFormContext<CreateBlotter>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "blotter.other_people_involved",
  });

  const addPerson = () => {
    append({
      full_name: "",
      address: "",
      contact_number: "",
      involvement: "WITNESS" as BlotterInvolvement,
    });
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Respondent Information ({fields.length})
          </h2>
          <button
            onClick={addPerson}
            type="button"
            className="w-fit cursor-pointer py-2 p-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200 flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiPlus />
            {t("helpDesk.blotterForm.buttons.addNewPerson")}
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          If known, please provide information about the person(s) involved
        </p>
        <div className="flex flex-col gap-4">
          {fields.length === 0 ? (
            <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <User className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p>No people added yet</p>
              <p className="text-sm">
                Click "Add Person" to include witnesses, victims, etc.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {fields.map((field, index) => (
                <div key={field.id} className="flex-1 p-4 border border-gray-200 bg-gray-50 hover:bg-gray-100 rounded-xl flex @container/add-involve">
                  <div className="flex-1 grid grid-cols-3 gap-4">
                    <span className="col-span-3 text-sm font-medium text-gray-600">
                      Resident #{index + 1}
                    </span>
                    <FormField
                      name={`blotter.other_people_involved.${index}.full_name`}
                      label={t("helpDesk.fields.fullName")}
                      placeholder={t("helpDesk.placeholders.fullName")}
                      required
                    />

                    <FormField
                      name={`blotter.other_people_involved.${index}.contact_number`}
                      label={t(
                        "helpDesk.fields.contactNumber"
                      )}
                      placeholder={t(
                        "helpDesk.placeholders.contactNumber"
                      )}
                      required
                    />

                    <FormField
                      type="select"
                      name={`blotter.other_people_involved.${index}.involvement`}
                      label={t("helpDesk.blotterForm.fields.involvement")}
                      placeholder={t(
                        "helpDesk.blotterForm.fields.involvement"
                      )}
                      options={blotterInvolvementOptions.map((role) => ({
                        value: role,
                        label: enumToTitleCase(role),
                      }))}
                      required
                    />

                    <div className="col-span-3">
                      <FormField
                        name={`blotter.other_people_involved.${index}.address`}
                        label={t("helpDesk.fields.completeAddress")}
                        placeholder={t("helpDesk.placeholders.completeAddress")}
                        required
                      />
                    </div>

                    {/* <input
                        {...register(
                        `blotter.other_people_involved.${index}.address`
                        )}
                    /> */}
                  </div>
                  <div className="flex items-start">
                                      {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                    title="Remove resident"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
