using RiskZero.Model;

namespace RiskZero.Service
{
    public interface ITokenService
    {
        string CreateAccessToken(User user);
        string CreateRefreshToken();
    }
}