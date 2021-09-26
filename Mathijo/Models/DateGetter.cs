using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mathijo.Models
{
    public static class DateGetter
    {
        public static DateTime[] DailySalesDates()
        {
            DateTime dateFrom = new(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, 0, 0, 0);
            DateTime dateUntil = dateFrom.AddDays(1);
            return new DateTime[] { dateFrom, dateUntil };
        }

        public static DateTime[] WeeklySalesDates()
        {
            DateTime dateFrom = DateTime.Today.AddDays(-1 * DateGetter.GetDayOfTheWeek());
            DateTime dateUntil = dateFrom.AddDays(7);
            return new DateTime[] { dateFrom, dateUntil };
        }

        public static DateTime[] MonthlySalesDates()
        {
            DateTime dateFrom = new(DateTime.Now.Year, DateTime.Now.Month, 1, 0, 0, 0);
            DateTime dateUntil = dateFrom.AddDays(DateTime.DaysInMonth(DateTime.Now.Year, DateTime.Now.Month));
            return new DateTime[] { dateFrom, dateUntil };
        }

        public static DateTime[] YearlySalesDates()
        {
            DateTime dateFrom = new(DateTime.Now.Year, 1, 1, 0, 0, 0);
            DateTime dateUntil = dateFrom.AddYears(1);
            return new DateTime[] { dateFrom, dateUntil };
        }

        public static int GetDayOfTheWeek()
        {
            int indexOfStartWeek = (int)DateTime.Today.DayOfWeek;
            switch (indexOfStartWeek)
            {
                case 0:
                    indexOfStartWeek = 6;
                    break;
                case 1:
                    indexOfStartWeek = 0;
                    break;
                case 2:
                    indexOfStartWeek = 1;
                    break;
                case 3:
                    indexOfStartWeek = 2;
                    break;
                case 4:
                    indexOfStartWeek = 3;
                    break;
                case 5:
                    indexOfStartWeek = 4;
                    break;
                case 6:
                    indexOfStartWeek = 5;
                    break;
            }
            return indexOfStartWeek;
        }
    }
}
