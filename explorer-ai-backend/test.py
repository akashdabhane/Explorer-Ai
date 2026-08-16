# from app import dense_index, to_namespace_name


# namespace = ""
# def get_all_chunks_by_namespace(notebookId: str="6a54ccbd7b364e9a63fd899f", userId: str="697204ac7b6a2899ccc77cf4"):
#     namespace = to_namespace_name(notebookId, userId)
#     try:
#         # Retrieve all records in the namespace
#         all_records = dense_index.list(namespace=namespace)
#         print(f"All records in namespace '{namespace}': {all_records}")
#         return all_records
#     except Exception as e:
#         return {"error": str(e)}, 500
    
# data = get_all_chunks_by_namespace()
# print(f"Retrieved data: {data}")
# for record in data:
#     print(f"Record: {record}")
#     for items in record:
#         print(f"Items: {items['id']}")
#         results = dense_index.fetch(ids=[items['id']], namespace=namespace)
#         print(f"Results for ID {items['id']}: {results}")

from langchain_community.document_loaders import UnstructuredURLLoader

loader = UnstructuredURLLoader("https://drive.google.com/file/d/1kkpXublEd4zR5iRjOcjWm0MQvF_nrtj5/view?usp=sharing")

documents = loader.load()

print(documents)
