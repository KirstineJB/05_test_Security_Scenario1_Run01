using BackendAPI.Models;

namespace BackendAPI.Services;

public class DocumentService : IDocumentService
{
    private readonly string _documentsPath;
    private readonly List<Document> _catalog;

    public DocumentService(IWebHostEnvironment env)
    {
        _documentsPath = Path.Combine(env.ContentRootPath, "SampleDocuments");

        _catalog =
        [
            new Document
            {
                Id = 1,
                Name = "Project Charter",
                Description = "Defines the project scope, objectives, and key stakeholders.",
                ContentType = "text/plain",
                FileSizeBytes = 0,
                UploadedAt = new DateTime(2025, 11, 3),
                FileName = "project-charter.txt"
            },
            new Document
            {
                Id = 2,
                Name = "Security Policy",
                Description = "Outlines the organisation's information security requirements and guidelines.",
                ContentType = "text/plain",
                FileSizeBytes = 0,
                UploadedAt = new DateTime(2026, 1, 15),
                FileName = "security-policy.txt"
            },
            new Document
            {
                Id = 3,
                Name = "API Design Specification",
                Description = "Technical specification describing the REST API endpoints and data contracts.",
                ContentType = "text/plain",
                FileSizeBytes = 0,
                UploadedAt = new DateTime(2026, 2, 28),
                FileName = "api-design-spec.txt"
            }
        ];

        foreach (var doc in _catalog)
        {
            var filePath = Path.Combine(_documentsPath, doc.FileName);
            if (File.Exists(filePath))
            {
                doc.FileSizeBytes = new FileInfo(filePath).Length;
            }
        }
    }

    public IEnumerable<Document> GetAll() => _catalog;

    public Document? GetById(int id) =>
        _catalog.FirstOrDefault(d => d.Id == id);

    public (Stream stream, string contentType, string fileName)? GetDownload(int id)
    {
        var doc = GetById(id);
        if (doc is null) return null;

        var filePath = Path.Combine(_documentsPath, doc.FileName);
        if (!File.Exists(filePath)) return null;

        return (File.OpenRead(filePath), doc.ContentType, doc.FileName);
    }
}
