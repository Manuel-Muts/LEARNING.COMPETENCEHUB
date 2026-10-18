import io
import unittest
import zipfile

from app.document_uploads import document_filename, validate_document


class DocumentUploadTests(unittest.TestCase):
    def test_document_filename_removes_client_path(self) -> None:
        self.assertEqual(document_filename(r"C:\fakepath\paper.pdf"), "paper.pdf")

    def test_accepts_valid_pdf(self) -> None:
        self.assertEqual(validate_document("paper.pdf", b"%PDF-1.7 content"), "application/pdf")

    def test_rejects_invalid_pdf_content(self) -> None:
        with self.assertRaisesRegex(ValueError, "valid PDF"):
            validate_document("paper.pdf", b"not a pdf")

    def test_accepts_legacy_word_document_signature(self) -> None:
        self.assertEqual(
            validate_document("paper.doc", bytes.fromhex("D0CF11E0A1B11AE1") + b"content"),
            "application/msword",
        )

    def test_accepts_docx_with_document_xml(self) -> None:
        file_buffer = io.BytesIO()
        with zipfile.ZipFile(file_buffer, "w") as word_file:
            word_file.writestr("word/document.xml", "<document />")
        self.assertEqual(
            validate_document("paper.docx", file_buffer.getvalue()),
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        )

    def test_rejects_non_word_zip_as_docx(self) -> None:
        file_buffer = io.BytesIO()
        with zipfile.ZipFile(file_buffer, "w") as zip_file:
            zip_file.writestr("not-a-document.txt", "content")
        with self.assertRaisesRegex(ValueError, "valid Word document"):
            validate_document("paper.docx", file_buffer.getvalue())

    def test_rejects_unsupported_file_type(self) -> None:
        with self.assertRaisesRegex(ValueError, "PDF, DOC, or DOCX"):
            validate_document("paper.txt", b"content")


if __name__ == "__main__":
    unittest.main()
