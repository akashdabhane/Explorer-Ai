from langchain_community.document_loaders import PyPDFLoader, TextLoader, Docx2txtLoader, UnstructuredMarkdownLoader, CSVLoader
import os

# Load documents helper function ============================
def load_documents(file_path):
    extension = os.path.splitext(file_path)[1].lower()

    if extension == ".pdf":
        loader = PyPDFLoader(file_path)
    elif extension == ".txt":
        loader = TextLoader(file_path)
    elif extension in [".docx", ".doc"]:
        loader = Docx2txtLoader(file_path)
    elif extension == ".md":
        loader = UnstructuredMarkdownLoader(file_path)
    elif extension == ".csv":
        loader = CSVLoader(file_path)
    
    else:
        raise ValueError("Unsupported file type: {}".format(extension))

    documents = loader.load()
    return documents

