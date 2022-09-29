using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Authorization.JWTToken
{
    public class JWTConfig
    {
        public string Key { get; set; }

        public string Issuer { get; set; }

        public string Audience { get; set; }
    }
}
