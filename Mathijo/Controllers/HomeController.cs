using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Mathijo.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult StartView()
        {
            return View();
        }

        public IActionResult BestellteProdukte()
        {
            return View();
        }

        public IActionResult Bestellungen()
        {
            return View();
        }

        public IActionResult Produktarten()
        {
            return View();
        }

        public IActionResult Produkte()
        {
            return View();
        }

        public IActionResult Tische()
        {
            return View();
        }

        public IActionResult Umsatz()
        {
            return View();
        }
    }
}
