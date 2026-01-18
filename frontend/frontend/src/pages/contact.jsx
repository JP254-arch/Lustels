import React, { useEffect } from "react";
// Optional: uncomment if you want animations
// import AOS from "aos";
// import "aos/dist/aos.css";

const Contact = () => {
  // Optional: initialize AOS
  // useEffect(() => { AOS.init({ duration: 1000, once: false, mirror: true }); }, []);

  useEffect(() => {
    const form = document.getElementById("contactForm");
    const formMessage = document.getElementById("formMessage");

    const showMessage = (msg, bgClass) => {
      formMessage.textContent = msg;
      formMessage.className = `mt-6 text-center text-white font-semibold px-4 py-3 rounded-lg ${bgClass} opacity-100 transform translate-y-0 transition-all duration-700`;
      setTimeout(() => {
        formMessage.className = `mt-6 text-center text-white font-semibold px-4 py-3 rounded-lg ${bgClass} opacity-0 transform translate-y-4 transition-all duration-700`;
      }, 4000);
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const data = new FormData(form);

      fetch(form.action, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      })
        .then((response) => {
          if (response.ok) {
            showMessage("✅ Message sent successfully!", "bg-green-500");
            form.reset();
          } else {
            response.json().then((data) => {
              showMessage(
                data?.errors?.map((err) => err.message).join(", ") ||
                  "❌ Oops! Something went wrong.",
                "bg-red-500"
              );
            });
          }
        })
        .catch(() => showMessage("❌ Oops! Something went wrong.", "bg-red-500"));
    });
  }, []);

  return (
    <section className="min-h-screen bg-gray-50 flex items-center py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-rose-600 mb-4">
            📚 Contact <span className="text-indigo-700">Lustels</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have a question, suggestion, or just want to say hi? We’d love to hear from you — your words are as valuable as our system!
          </p>
        </div>

        {/* Layout */}
        <div className="flex flex-col lg:flex-row gap-10 items-stretch">
          {/* Left: Contact Form */}
          <div className="lg:w-1/2 bg-white rounded-2xl shadow-2xl border border-gray-100 p-8">
            <h2 className="text-2xl font-semibold text-rose-700 mb-6 text-center">
              Send Us a Message
            </h2>
            <form
              id="contactForm"
              action="https://formspree.io/f/xojqzyrl"
              method="POST"
              className="space-y-6"
            >
              <div>
                <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="e.g. Jp Mbaga"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-500 transition"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="e.g. jp@lustels.com"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-500 transition"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                  Your Message
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows="5"
                  placeholder="Type your message here..."
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-500 transition"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all duration-200"
              >
                ✉️ Send Message
              </button>
            </form>

            <div
              id="formMessage"
              className="mt-6 text-center text-white font-semibold px-4 py-3 rounded-lg opacity-0 transform translate-y-4 transition-all duration-700"
            ></div>
          </div>

          {/* Right: Contact Info */}
          <div className="lg:w-1/2 flex flex-col justify-center bg-gradient-to-br from-indigo-50 to-rose-50 p-10 rounded-2xl shadow-inner border border-gray-100">
            <h2 className="text-2xl font-semibold text-indigo-700 mb-6">Or Reach Us Directly</h2>

            <div className="space-y-4 text-gray-700">
              <p>
                <span className="font-medium text-rose-600">📧 Email:</span>{" "}
                <a href="mailto:info@lustels.com" className="text-indigo-600 hover:underline">info@lustels.com</a> |{" "}
                <a href="mailto:helpline@lustels.com" className="text-indigo-600 hover:underline">helpline@lustels.com</a>
              </p>
              <p>
                <span className="font-medium text-rose-600">📞 Phone:</span>{" "}
                <a href="tel:+1234567890" className="text-indigo-600 hover:underline">+1 (234) 567-890</a>
              </p>
              <p>
                <span className="font-medium text-rose-600">📌 Address:</span> 123 Lustels St, Knowledge City
              </p>
            </div>

            <div className="mt-8 text-gray-500 text-sm italic border-t border-gray-200 pt-4">
              “Lustels — where curiosity meets knowledge, and every student has a story to tell.”
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
