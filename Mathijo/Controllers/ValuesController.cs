using DatabaseHelper;
using ExceptionFramework;
using Mathijo.Models;
using MathijoAssembly;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace Mathijo.Controllers
{
    public record OrderData(Guid ID_Produkt, Guid ID_Bestellung);
    public record ProductData(string ProductName, decimal Prize, Guid IDProductType);
    public record ProductDataWithID(string ProductName, decimal Prize, Guid IDProduct);
    public record GuidAndECS(Guid? NewID, ExceptionCheckState Ecs);
    public record AllOrdersAndOrderedProducts(Guid ID_Order, int TableNumber, DateTime Date, List<ProductDataForAllOrders> OrderedProducts, decimal TotalPrize);
    public record ProductDataForAllOrders(int Amount, string ProductName, decimal Prize);

    [ApiController]
    [Route("[controller]")]
    public class ValuesController : Controller
    {
        [HttpGet("GetAllProductTypes")]
        public IEnumerable<object> GetAllProductTypes()
        {
            return DBHelper.SelectAll<S_Produkt_Arten>().Where(x => x.Geloescht == false).OrderBy(x => x.Reihenfolge);
        }

        [HttpGet("GetTables")]
        public IEnumerable<object> GetTables()
        {
            return DBHelper.SelectAll<S_Tische>().Where(x => x.Geloescht == false).OrderBy(x => x.Tischnummer);
        }

        [HttpPost("GetProductsOfProductType")]
        public IEnumerable<object> GetProductsOfProductType(Guid idProductType)
        {
            S_Produkte produkt = new();
            produkt.ID_Produkt_Art = idProductType;
            return DBHelper.Select(produkt).Where(x => x.Geloescht == false);
        }

        [HttpPost("CreateNewOrder")]
        public Guid? CreateNewOrder(Guid idTisch)
        {
            W_Bestellungen bestellung = new()
            {
                ID = Guid.NewGuid(),
                ID_Tisch = idTisch,
                Bestelldatum = DateTime.Now,
                Abgeschlossen = false
            };
            DBHelper.Insert(bestellung);
            return bestellung.ID;
        }

        [HttpGet("GetOrderForTable")]
        public IEnumerable<object> GetOrderForTable()
        {
            return DBHelper.SelectAll<W_Bestellungen>().Where(x => x.Abgeschlossen == false);
        }

        [HttpPost("CreateOrderedProduct")]
        public Guid? CreateOrderedProduct(OrderData orderData)
        {
            W_Bestellte_Produkte bestelltesProdukt = new()
            {
                ID = Guid.NewGuid(),
                ID_Produkt = orderData.ID_Produkt,
                ID_Bestellung = orderData.ID_Bestellung,
                Menge = 1,
                Bezahlt = false
            };
            DBHelper.Insert(bestelltesProdukt);
            return bestelltesProdukt.ID;
        }

        [HttpGet("UpdateOrderedProductPlus")]
        public void UpdateOrderedProductPlus(Guid idOrderedProduct)
        {
            W_Bestellte_Produkte bestelltesProdukt = DBHelper.SelectByID<W_Bestellte_Produkte>(idOrderedProduct);
            bestelltesProdukt.Menge++;
            DBHelper.Update(bestelltesProdukt);
        }

        [HttpGet("UpdateOrderedProductMinus")]
        public void UpdateOrderedProductMinus(Guid idOrderedProduct)
        {
            W_Bestellte_Produkte bestelltesProdukt = DBHelper.SelectByID<W_Bestellte_Produkte>(idOrderedProduct);
            bestelltesProdukt.Menge--;
            DBHelper.Update(bestelltesProdukt);
        }

        [HttpGet("DeleteOrderedProduct")]
        public void DeleteOrderedProduct(Guid idOrderedProduct)
        {
            DBHelper.Delete<W_Bestellte_Produkte>(idOrderedProduct);
        }

        [HttpGet("GetOrderedProducts")]
        public IEnumerable<object> GetOrderedProducts(Guid idOrder)
        {
            W_Bestellte_Produkte bestellteProdukte = new()
            {
                ID_Bestellung = idOrder,
                Bezahlt = false
            };
            return DBHelper.Select(bestellteProdukte);
        }

        [HttpGet("GetProductByID")]
        public object GetProductByID(Guid idProduct)
        {
            return DBHelper.SelectByID<S_Produkte>(idProduct);
        }

        [HttpGet("FinishOrder")]
        public void FinishOrder(Guid idOrder)
        {
            W_Bestellungen bestellung = DBHelper.SelectByID<W_Bestellungen>(idOrder);
            bestellung.Abgeschlossen = true;
            bestellung.Bestelldatum = DateTime.Now;
            W_Bestellte_Produkte bestelltesProdukt = new()
            {
                ID_Bestellung = bestellung.ID
            };
            IEnumerable<W_Bestellte_Produkte> bestellteProdukte = DBHelper.Select(bestelltesProdukt);
            foreach (W_Bestellte_Produkte bp in bestellteProdukte)
            {
                bp.Bezahlt = true;
                DBHelper.Update(bp);
            }
            DBHelper.Update(bestellung);
        }

        [HttpGet("UpdateOrderedProductPaid")]
        public void UpdateOrderedProductPaid(Guid idOrderedProduct)
        {
            W_Bestellte_Produkte bestelltesProdukt = DBHelper.SelectByID<W_Bestellte_Produkte>(idOrderedProduct);
            bestelltesProdukt.Bezahlt = true;
            DBHelper.Update(bestelltesProdukt);
        }

        [HttpGet("CreateNewProductType")]
        public GuidAndECS CreateNewProductType(string productTypeName)
        {
            try
            {
                S_Produkt_Arten produktArt = new()
                {
                    ID = Guid.NewGuid(),
                    Produkt_Art = productTypeName,
                    Reihenfolge = DBHelper.SelectAll<S_Produkt_Arten>().Count(),
                    Geloescht = false
                };
                string worked = DBHelper.Insert(produktArt);
                if (worked == "Worked")
                {
                    return new GuidAndECS(produktArt.ID, new ExceptionCheckState("", "Neue Produktart erfolgreich hinzugefügt", "Erfolgreich", _Status.Ok, DisplayType.DialogOnly));
                }
                else
                {
                    return new GuidAndECS(Guid.Empty, new ExceptionCheckState("", worked, "Fehler", _Status.Error, DisplayType.DialogOnly));
                }

            }
            catch (Exception exc)
            {
                return new GuidAndECS(Guid.Empty, new ExceptionCheckState("", exc.Message, "Fehler", _Status.Error, DisplayType.DialogOnly));
            }
        }

        [HttpGet("DeleteProductType")]
        public ExceptionCheckState DeleteProductType(Guid idProductType)
        {
            try
            {
                string worked = DBHelper.Delete<S_Produkt_Arten>(idProductType);
                if (worked == "Worked")
                {
                    return new ExceptionCheckState("", "Produktart erfolgreich gelöscht", "Erfolgreich", _Status.Ok, DisplayType.DialogOnly);
                }
                else
                {
                    return new ExceptionCheckState("", worked, "Fehler", _Status.Error, DisplayType.DialogOnly);
                }
            }
            catch (Exception exc)
            {
                return new ExceptionCheckState("", exc.Message, "Fehler", _Status.Error, DisplayType.DialogOnly);
            }

        }

        [HttpGet("UpdateProductType")]
        public ExceptionCheckState UpdateProductType(string productTypeName, Guid idProductType)
        {
            try
            {
                S_Produkt_Arten produktArt = DBHelper.SelectByID<S_Produkt_Arten>(idProductType);
                produktArt.Produkt_Art = productTypeName;
                string worked = DBHelper.Update(produktArt);
                if (worked == "Worked")
                {
                    return new ExceptionCheckState("", "Produktarten erfolgreich aktualisiert", "Erfolgreich", _Status.Ok, DisplayType.DialogOnly);
                }
                else
                {
                    return new ExceptionCheckState("", worked, "Fehler", _Status.Error, DisplayType.DialogOnly);
                }
            }
            catch (Exception exc)
            {
                return new ExceptionCheckState("", exc.Message, "Fehler", _Status.Error, DisplayType.DialogOnly);
            }

        }

        [HttpPost("CreateNewProduct")]
        public GuidAndECS CreateNewProduct(ProductData productData)
        {
            try
            {
                S_Produkte produkt = new()
                {
                    ID = Guid.NewGuid(),
                    ID_Produkt_Art = productData.IDProductType,
                    Preis = productData.Prize,
                    ProduktName = productData.ProductName,
                    Geloescht = false
                };
                string worked = DBHelper.Insert(produkt);
                if (worked == "Worked")
                {
                    return new GuidAndECS(produkt.ID, new ExceptionCheckState("", "Neues Produkt erfolgreich hinzugefügt", "Erfolgreich", _Status.Ok, DisplayType.DialogOnly));
                }
                else
                {
                    return new GuidAndECS(Guid.Empty, new ExceptionCheckState("", worked, "Fehler", _Status.Error, DisplayType.DialogOnly));

                }
            }
            catch (Exception exc)
            {
                return new GuidAndECS(Guid.Empty, new ExceptionCheckState("", exc.Message, "Fehler", _Status.Error, DisplayType.DialogOnly));
            }

        }

        [HttpGet("DeleteProduct")]
        public ExceptionCheckState DeleteProduct(Guid idProduct)
        {
            try
            {
                string worked = DBHelper.Delete<S_Produkte>(idProduct);
                if (worked == "Worked")
                {
                    return new ExceptionCheckState("", "Produkt erfolgreich gelöscht", "Erfolgreich", _Status.Ok, DisplayType.DialogOnly);
                }
                else
                {
                    return new ExceptionCheckState("", worked, "Fehler", _Status.Error, DisplayType.DialogOnly);
                }
            }
            catch (Exception exc)
            {
                return new ExceptionCheckState("", exc.Message, "Fehler", _Status.Error, DisplayType.DialogOnly);
            }
        }

        [HttpPost("UpdateProduct")]
        public ExceptionCheckState UpdateProduct(ProductDataWithID productData)
        {
            try
            {
                S_Produkte produkt = DBHelper.SelectByID<S_Produkte>(productData.IDProduct);
                produkt.ProduktName = productData.ProductName;
                produkt.Preis = productData.Prize;
                string worked = DBHelper.Update(produkt);
                if (worked == "Worked")
                {
                    return new ExceptionCheckState("", "Produkte erfolgreich aktualisiert", "Erfolgreich", _Status.Ok, DisplayType.DialogOnly);
                }
                else
                {
                    return new ExceptionCheckState("", worked, "Fehler", _Status.Error, DisplayType.DialogOnly);
                }
            }
            catch (Exception exc)
            {
                return new ExceptionCheckState("", exc.Message, "Fehler", _Status.Error, DisplayType.DialogOnly);
            }
        }

        [HttpGet("CreateNewTable")]
        public GuidAndECS CreateNewTable(int tableNumber)
        {
            try
            {
                S_Tische tisch = new()
                {
                    ID = Guid.NewGuid(),
                    Tischnummer = tableNumber,
                    Geloescht = false
                };
                string worked = DBHelper.Insert(tisch);
                if (worked == "Worked")
                {
                    return new GuidAndECS(tisch.ID, new ExceptionCheckState("", "Neuer Tisch erfolgreich hinzugefügt", "Erfolgreich", _Status.Ok, DisplayType.DialogOnly));
                }
                else
                {
                    return new GuidAndECS(Guid.Empty, new ExceptionCheckState("", worked, "Fehler", _Status.Error, DisplayType.DialogOnly));

                }
            }
            catch (Exception exc)
            {
                return new GuidAndECS(Guid.Empty, new ExceptionCheckState("", exc.Message, "Fehler", _Status.Error, DisplayType.DialogOnly));
            }

        }

        [HttpGet("DeleteTable")]
        public ExceptionCheckState DeleteTable(Guid idTable)
        {
            try
            {
                S_Tische tisch = DBHelper.SelectByID<S_Tische>(idTable);
                tisch.Geloescht = true;
                string worked = DBHelper.Update(tisch);
                if (worked == "Worked")
                {
                    return new ExceptionCheckState("", "Tisch erfolgreich gelöscht", "Erfolgreich", _Status.Ok, DisplayType.DialogOnly);
                }
                else
                {
                    return new ExceptionCheckState("", worked, "Fehler", _Status.Error, DisplayType.DialogOnly);
                }
            }
            catch (Exception exc)
            {
                return new ExceptionCheckState("", exc.Message, "Fehler", _Status.Error, DisplayType.DialogOnly);
            }
        }

        [HttpGet("GetOrdersAndOrderedProducts")]
        public OrderListAndTotalSales GetOrdersAndOrderedProducts(DateTime dateFrom, DateTime dateUntil)
        {
            decimal totalSales = 0;
            List<AllOrdersAndOrderedProducts> listAllOrdersAndProducts = new();
            List<W_Bestellungen> bestellungen = DBHelper.SelectAll<W_Bestellungen>().Where(x => x.Bestelldatum > dateFrom && x.Bestelldatum < dateUntil && x.Abgeschlossen == true).ToList();
            foreach (W_Bestellungen bestellung in bestellungen)
            {
                W_Bestellte_Produkte bestelltesProduktTemplate = new();
                bestelltesProduktTemplate.ID_Bestellung = bestellung.ID;
                List<W_Bestellte_Produkte> listBestellteProdukte = DBHelper.Select(bestelltesProduktTemplate).ToList();
                List<ProductDataForAllOrders> listProductDataForAllOrders = new();
                decimal totalPrize = 0;
                foreach (W_Bestellte_Produkte bestelltesProdukt in listBestellteProdukte)
                {
                    S_Produkte produkt = DBHelper.SelectByID<S_Produkte>((Guid)bestelltesProdukt.ID_Produkt);
                    ProductDataForAllOrders productDataForAllOrders = new((int)bestelltesProdukt.Menge, produkt.ProduktName, (decimal)produkt.Preis);
                    listProductDataForAllOrders.Add(productDataForAllOrders);
                    totalPrize += ((decimal)produkt.Preis * (int)bestelltesProdukt.Menge);

                }
                totalSales += totalPrize;
                S_Tische tisch = DBHelper.SelectByID<S_Tische>((Guid)bestellung.ID_Tisch);
                AllOrdersAndOrderedProducts allOrdersAndOrderedProducts = new((Guid)bestellung.ID, (int)tisch.Tischnummer, (DateTime)bestellung.Bestelldatum, listProductDataForAllOrders, totalPrize);
                listAllOrdersAndProducts.Add(allOrdersAndOrderedProducts);
            }
            return new OrderListAndTotalSales(listAllOrdersAndProducts, totalSales);
        }

        [HttpGet("GetOrderedProductsAdmin")]
        public IEnumerable<object> GetOrderedProductsAdmin(DateTime dateFrom, DateTime dateUntil, Guid idProductType)
        {
            List<ProductDataForAllOrderedProducts> listProductDataForAllOrderedProducts = new();
            List<W_Bestellungen> bestellungen = DBHelper.SelectAll<W_Bestellungen>().Where(x => x.Bestelldatum > dateFrom && x.Bestelldatum < dateUntil).ToList();
            foreach (W_Bestellungen bestellung in bestellungen)
            {
                W_Bestellte_Produkte bestellteProdukteTemplate = new();
                bestellteProdukteTemplate.ID_Bestellung = bestellung.ID;
                List<W_Bestellte_Produkte> bestellteProdukte = DBHelper.Select(bestellteProdukteTemplate).ToList();
                foreach (W_Bestellte_Produkte bestelltesProdukt in bestellteProdukte)
                {
                    bool isAlreadyInThere = false;
                    S_Produkte produkt = DBHelper.SelectByID<S_Produkte>((Guid)bestelltesProdukt.ID_Produkt);
                    foreach (ProductDataForAllOrderedProducts forAllOrderedProducts in listProductDataForAllOrderedProducts)
                    {
                        if (forAllOrderedProducts.ID_Product == produkt.ID)
                        {
                            forAllOrderedProducts.Amount += (int)bestelltesProdukt.Menge;
                            forAllOrderedProducts.Prize = forAllOrderedProducts.Amount * (decimal)produkt.Preis;
                            isAlreadyInThere = true;
                        }
                    }
                    if (!isAlreadyInThere)
                    {
                        if (produkt.ID_Produkt_Art == idProductType || idProductType == Guid.Empty)
                        {
                            decimal totalPrize = (int)bestelltesProdukt.Menge * (decimal)produkt.Preis;
                            ProductDataForAllOrderedProducts productDataForAllOrderedProducts = new((Guid)produkt.ID, (int)bestelltesProdukt.Menge, produkt.ProduktName, totalPrize);
                            listProductDataForAllOrderedProducts.Add(productDataForAllOrderedProducts);
                        }
                    }
                }
            }
            return listProductDataForAllOrderedProducts;
        }

        [HttpGet("GetSales")]
        public decimal[] GetSales()
        {
            decimal[] sales = new decimal[4];
            sales[0] = DateGetter.SaleFinder(DateGetter.DailySalesDates()[0], DateGetter.DailySalesDates()[1]);
            sales[1] = DateGetter.SaleFinder(DateGetter.WeeklySalesDates()[0], DateGetter.WeeklySalesDates()[1]);
            sales[2] = DateGetter.SaleFinder(DateGetter.MonthlySalesDates()[0], DateGetter.MonthlySalesDates()[1]);
            sales[3] = DateGetter.SaleFinder(DateGetter.YearlySalesDates()[0], DateGetter.YearlySalesDates()[1]);
            return sales;
        }

        [HttpGet("GetTop3OrderedProducts")]
        public string[] GetTop3OrderedProducts()
        {
            List<ProductDataForAllOrderedProducts> listProductDataForAllOrderedProducts = new();
            List<W_Bestellungen> bestellungen = DBHelper.SelectAll<W_Bestellungen>().ToList();
            foreach (W_Bestellungen bestellung in bestellungen)
            {
                W_Bestellte_Produkte bestellteProdukteTemplate = new();
                bestellteProdukteTemplate.ID_Bestellung = bestellung.ID;
                List<W_Bestellte_Produkte> bestellteProdukte = DBHelper.Select(bestellteProdukteTemplate).ToList();
                foreach (W_Bestellte_Produkte bestelltesProdukt in bestellteProdukte)
                {
                    bool isAlreadyInThere = false;
                    S_Produkte produkt = DBHelper.SelectByID<S_Produkte>((Guid)bestelltesProdukt.ID_Produkt);
                    foreach (ProductDataForAllOrderedProducts forAllOrderedProducts in listProductDataForAllOrderedProducts)
                    {
                        if (forAllOrderedProducts.ID_Product == produkt.ID)
                        {
                            forAllOrderedProducts.Amount += (int)bestelltesProdukt.Menge;
                            forAllOrderedProducts.Prize = forAllOrderedProducts.Amount * (decimal)produkt.Preis;
                            isAlreadyInThere = true;
                        }
                    }
                    if (!isAlreadyInThere)
                    {
                        decimal totalPrize = (int)bestelltesProdukt.Menge * (decimal)produkt.Preis;
                        ProductDataForAllOrderedProducts productDataForAllOrderedProducts = new((Guid)produkt.ID, (int)bestelltesProdukt.Menge, produkt.ProduktName, totalPrize);
                        listProductDataForAllOrderedProducts.Add(productDataForAllOrderedProducts);
                    }
                }
            }
            listProductDataForAllOrderedProducts = listProductDataForAllOrderedProducts.OrderByDescending(x => x.Amount).ToList();
            return new string[] {listProductDataForAllOrderedProducts[0].ProductName, listProductDataForAllOrderedProducts[1].ProductName,
                listProductDataForAllOrderedProducts[2].ProductName, listProductDataForAllOrderedProducts[3].ProductName, listProductDataForAllOrderedProducts[4].ProductName};
        }

        [HttpGet("GetSalesEveryDayOfThisWeek")]
        public decimal[] GetSalesEveryDayOfThisWeek()
        {
            decimal[] salesWholeWeek = new decimal[7];
            for (int i = 1; i < 8; i++)
            {
                List<W_Bestellungen> bestellungen = DBHelper.SelectAll<W_Bestellungen>()
                    .Where(x => x.Bestelldatum > DateGetter.WeeklySalesDates()[0].AddDays(i - 1) && x.Bestelldatum < DateGetter.WeeklySalesDates()[0].AddDays(i)).ToList();
                if (bestellungen.Any())
                {
                    foreach (W_Bestellungen bestellung in bestellungen)
                    {
                        W_Bestellte_Produkte bestellteProdukteTemplate = new();
                        bestellteProdukteTemplate.ID_Bestellung = bestellung.ID;
                        List<W_Bestellte_Produkte> bestellteProdukte = DBHelper.Select(bestellteProdukteTemplate).ToList();
                        foreach (W_Bestellte_Produkte bestelltesProdukt in bestellteProdukte)
                        {
                            S_Produkte produkt = DBHelper.SelectByID<S_Produkte>((Guid)bestelltesProdukt.ID_Produkt);
                            salesWholeWeek[i - 1] += (int)bestelltesProdukt.Menge * (decimal)produkt.Preis;
                        }
                    }
                }
            }
            return salesWholeWeek;
        }

        [HttpGet("GetSalesEveryDayOfLastWeek")]
        public decimal[] GetSalesEveryDayOfLastWeek()
        {
            int counter = 0;
            decimal[] salesWholeWeek = new decimal[7];
            for (int i = 8; i > 1; i--)
            {
                List<W_Bestellungen> bestellungen = DBHelper.SelectAll<W_Bestellungen>()
                    .Where(x => x.Bestelldatum > DateGetter.WeeklySalesDates()[0].AddDays((i - 1) * -1) && x.Bestelldatum < DateGetter.WeeklySalesDates()[0].AddDays((i - 2) * -1)).ToList();
                foreach (W_Bestellungen bestellung in bestellungen)
                {
                    W_Bestellte_Produkte bestellteProdukteTemplate = new();
                    bestellteProdukteTemplate.ID_Bestellung = bestellung.ID;
                    List<W_Bestellte_Produkte> bestellteProdukte = DBHelper.Select(bestellteProdukteTemplate).ToList();
                    foreach (W_Bestellte_Produkte bestelltesProdukt in bestellteProdukte)
                    {
                        S_Produkte produkt = DBHelper.SelectByID<S_Produkte>((Guid)bestelltesProdukt.ID_Produkt);
                        salesWholeWeek[counter] += (int)bestelltesProdukt.Menge * (decimal)produkt.Preis;
                    }
                }
                counter++;
            }
            return salesWholeWeek;
        }

        [HttpPost("CheckPassword")]
        public ExceptionCheckState CheckPassword(string passwordInput)
        {
            if (passwordInput == "74545")
            {
                HttpContext.Session.SetString("PW", "Success");
                return new ExceptionCheckState();
            }
            else
            {
                return new ExceptionCheckState("", "Falsches Passwort", "Fehler", _Status.Error, DisplayType.DialogOnly);
            }
        }

        [HttpGet("IsLoggedIn")]
        public bool IsLoggedIn()
        {
            if (HttpContext.Session.GetString("PW") == "Success")
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        [HttpGet("RemoveSession")]
        public void RemoveSession()
        {
            HttpContext.Session.Clear();
        }

        [HttpGet("GetTableNumberByID")]
        public int GetTableNumberByID(Guid idTable)
        {
            return (int)DBHelper.SelectByID<S_Tische>(idTable).Tischnummer;
        }

        [HttpGet("GetSortedActiveOrders")]
        public IEnumerable<object> GetSortedActiveOrders()
        {
            List<W_Bestellungen> allActiveOrders = new();
            List<W_Bestellungen> allOrders = DBHelper.SelectAll<W_Bestellungen>().Where(x => x.Abgeschlossen == false).ToList();
            foreach(W_Bestellungen order in allOrders)
            {
                W_Bestellte_Produkte orderedProductTemplate = new();
                orderedProductTemplate.ID_Bestellung = order.ID;
                List<W_Bestellte_Produkte> orderedProducts = DBHelper.Select(orderedProductTemplate).ToList();
                if (orderedProducts.Any())
                {
                    allActiveOrders.Add(order);
                }
            }
            List<W_Bestellungen> orderedList = new();
            List<S_Tische> allTables = DBHelper.SelectAll<S_Tische>().OrderBy(x => x.Tischnummer).ToList();
            foreach(S_Tische table in allTables)
            {
                W_Bestellungen order = allActiveOrders.Where(x => x.ID_Tisch == table.ID).FirstOrDefault();
                if(order is not null)
                {
                    orderedList.Add(order);
                }
            }
            return orderedList;
        }
    }
}
