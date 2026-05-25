using Amazon.S3;
using Amazon.S3.Transfer;
using muvinBackend.Interfaces;

namespace muvinBackend.Services;

public class StorageService : IStorageService
{
    private readonly AmazonS3Client _client;
    private readonly string _bucket;
    private readonly string _cdnEndpoint;

    public StorageService(IConfiguration config)
    {
        var section = config.GetSection("DigitalOcean");
        _bucket = section["SpacesBucket"]!;
        _cdnEndpoint = section["SpacesCdnEndpoint"]!.TrimEnd('/');

        var region = section["SpacesRegion"]!;
        _client = new AmazonS3Client(
            section["SpacesAccessKey"],
            section["SpacesSecretKey"],
            new AmazonS3Config
            {
                ServiceURL = $"https://{region}.digitaloceanspaces.com"
            }
        );
    }

    public async Task<string> UploadAsync(Stream stream, string fileName, string contentType)
    {
        var ext = Path.GetExtension(fileName).ToLowerInvariant();
        var key = $"uploads/{Guid.NewGuid()}{ext}";

        var request = new TransferUtilityUploadRequest
        {
            InputStream = stream,
            Key = key,
            BucketName = _bucket,
            ContentType = contentType,
            CannedACL = S3CannedACL.PublicRead
        };

        await new TransferUtility(_client).UploadAsync(request);

        return $"{_cdnEndpoint}/{key}";
    }
}
