export function readUploadedFileAsText(file) {
    return new Promise((resolve, reject) => {
        if (!file) {
          reject("No file provided.");
          return;
        }

        const reader = new FileReader();

        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject("Error reading file: " + reader.error);

        reader.readAsText(file);
      });
  }
  