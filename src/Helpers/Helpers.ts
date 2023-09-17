import {__} from "@wordpress/i18n";

export const validateRequiredFields = (data: any, requiredFields: string[], setFormError: (errors: any) => void) => {
    const errors: any = {};
    setFormError({});
    requiredFields.forEach((field) => {
        if (!data[field] && data[field] !== 0) {
            errors[field] = __('This field is required', 'plugin-name');
        }
    });
    setFormError(errors);
    return errors;
}
