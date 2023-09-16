import {__} from "@wordpress/i18n";

export const validateRequiredFields = (data: any, requiredFields: string[], setFormError: (errors: any) => void) => {
    const errors: any = {};
    setFormError({});
    requiredFields.forEach((field) => {
        if (!data[field] && data[field] !== 0) {
            errors[field] = __('This field is required', 'pcm');
        }
    });
    setFormError(errors);
    return errors;
}
