import io
import zipfile
from pathlib import PurePosixPath


DOCUMENT_CONTENT_TYPES = {
    ".pdf": "application/pdf",
    ".doc": "application/msword",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}
WORD_DOCUMENT_SIGNATURE = bytes.fromhex("D0CF11E0A1B11AE1")


def document_filename(filename: str | None) -> str:
    return PurePosixPath((filename or "").replace("\\", "/")).name


def validate_document(filename: str, content: bytes) -> str:
    extension = PurePosixPath(filename).suffix.lower()
    content_type = DOCUMENT_CONTENT_TYPES.get(extension)
    if content_type is None:
        raise ValueError("Upload a PDF, DOC, or DOCX file.")
    if extension == ".pdf" and not content.startswith(b"%PDF-"):
        raise ValueError("The uploaded file is not a valid PDF.")
    if extension == ".doc" and not content.startswith(WORD_DOCUMENT_SIGNATURE):
        raise ValueError("The uploaded file is not a valid Word document.")
    if extension == ".docx":
        try:
            with zipfile.ZipFile(io.BytesIO(content)) as word_file:
                if "word/document.xml" not in word_file.namelist():
                    raise ValueError("The uploaded file is not a valid Word document.")
        except zipfile.BadZipFile as error:
            raise ValueError("The uploaded file is not a valid Word document.") from error
    return content_type
