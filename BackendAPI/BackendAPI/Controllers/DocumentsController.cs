using BackendAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace BackendAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DocumentsController : ControllerBase
{
    private readonly IDocumentService _documentService;

    public DocumentsController(IDocumentService documentService)
    {
        _documentService = documentService;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var documents = _documentService.GetAll();
        return Ok(documents);
    }

    [HttpGet("{id}/download")]
    public IActionResult Download(int id)
    {
        var result = _documentService.GetDownload(id);
        if (result is null)
            return NotFound();

        var (stream, contentType, fileName) = result.Value;
        return File(stream, contentType, fileName);
    }
}
