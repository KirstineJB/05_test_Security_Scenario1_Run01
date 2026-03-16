using BackendAPI.Models;

namespace BackendAPI.Services;

public interface IDocumentService
{
    IEnumerable<Document> GetAll();
    Document? GetById(int id);
    (Stream stream, string contentType, string fileName)? GetDownload(int id);
}
