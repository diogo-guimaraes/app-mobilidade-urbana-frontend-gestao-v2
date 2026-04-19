import { computed, reactive, watch } from "vue";

export function useForm(config) {
  const { fields = {}, files = {}, defaultValues = {} } = config;

  const form = {
    files: reactive({}),
  };

  Object.keys(fields).forEach((key) => {
    if (key === "files") return;

    form[key] = reactive({
      value: fields[key],
      error: false,
      errorMessage: "",
    });
  });

  Object.keys(files).forEach((key) => {
    const data = reactive({
      file: files[key],
      preview: null,
      error: false,
      errorMessage: "",
    });

    watch(
      () => data.file,
      (newFile, oldFile) => {
        if (
          oldFile instanceof File &&
          data.preview &&
          data.preview.startsWith("blob:")
        ) {
          URL.revokeObjectURL(data.preview);
        }

        if (newFile instanceof File && newFile.type.startsWith("image/")) {
          data.preview = URL.createObjectURL(newFile);
        } else if (typeof newFile === "string") {
          data.preview = newFile;
        } else {
          data.preview = null;
        }
      },
      { immediate: true }
    );

    form.files[key] = data;
  });

  form.setError = (field, message) => {
    if (typeof field !== "string" || typeof message !== "string") return;

    const set = (t, k) => {
      if (k in t && typeof t[k] !== "function") {
        t[k].error = true;
        t[k].errorMessage = message;
      }
    };

    if (field.startsWith("files.")) set(form.files, field.split(".")[1]);
    else if (field in form && typeof form[field] !== "function")
      set(form, field);
    else if (field in form.files) set(form.files, field);
  };

  form.clearError = (field = null) => {
    if (field !== null && typeof field !== "string") return;

    const set = (t, k) => {
      if (k in t && typeof t[k] !== "function") {
        t[k].error = false;
        t[k].errorMessage = "";
      }
    };

    if (field) {
      if (field.startsWith("files.")) set(form.files, field.split(".")[1]);
      else if (field in form) set(form, field);
      else if (field in form.files) set(form.files, field);
    } else {
      Object.keys(fields).forEach((key) => set(form, key));
      Object.keys(files).forEach((key) => set(form.files, key));
    }
  };

  form.clear = (field = null) => {
    const inferDefaultValue = (value) => {
      if (typeof value === "boolean") return false;
      if (typeof value === "string") return "";
      if (Array.isArray(value)) return [];
      return null;
    };

    const reset = (f) => {
      if (f !== "files" && f in form && typeof form[f] !== "function") {
        form[f].value =
          f in defaultValues ? defaultValues[f] : inferDefaultValue(fields[f]);
        form[f].error = false;
        form[f].errorMessage = "";
      }
    };

    field ? reset(field) : Object.keys(fields).forEach(reset);
  };

  form.clearFile = (file = null) => {
    const reset = (f) => {
      if (f in form.files) {
        form.files[f].file = null;
        form.files[f].error = false;
        form.files[f].errorMessage = "";
      }
    };

    file ? reset(file) : Object.keys(files).forEach(reset);
  };

  const _hasErrors = computed(() => {
    const fieldHasError = Object.keys(fields).some((key) => form[key].error);
    if (fieldHasError) return;
    const fileHasError = Object.keys(files).some(
      (key) => form.files[key].error
    );
    if (fileHasError) return;
  });

  Object.defineProperty(form, "hasErrors", {
    get: () => _hasErrors.value,
    enumerable: true,
  });

  return form;
}
