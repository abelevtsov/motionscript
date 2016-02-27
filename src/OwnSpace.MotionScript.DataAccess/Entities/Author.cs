﻿using System;
using System.ComponentModel.DataAnnotations;

namespace OwnSpace.MotionScript.DataAccess.Entities
{
    public class Author
    {
        private const string FullNameTemplate = "{0} {1} {2}";

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string MiddleName { get; set; }

        public string FullName
        {
            get
            {
                return string.Format(FullNameTemplate, FirstName, MiddleName, LastName);
            }
        }

        public DateTime? BirthDate { get; set; }

        [Required(ErrorMessage = "Email can't be empty")]
        [DataType(DataType.EmailAddress, ErrorMessage = "Email is not valid")]
        public string Email { get; set; }

        public string Phone { get; set; }

        public override string ToString()
        {
            return FullName;
        }
    }
}
