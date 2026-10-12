package com.manthan.rentloop.configuration;

import com.manthan.rentloop.model.*;
import com.manthan.rentloop.repository.CategoryRepository;
import com.manthan.rentloop.repository.ItemRepository;
import com.manthan.rentloop.repository.ListingRepository;
import com.manthan.rentloop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final ItemRepository itemRepository;
    private final ListingRepository listingRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // 1. Seed Categories if empty
        if (categoryRepository.count() == 0) {
            List<String[]> defaultCategories = List.of(
                    new String[]{"Laptops & Tech", "Laptops, tablets, displays, and high-performance computing devices"},
                    new String[]{"Cameras & Optics", "DSLRs, mirrorless, lenses, gimbals, drones, and lighting"},
                    new String[]{"Musical Instruments", "Guitars, keyboards, synthesizers, amps, and studio gear"},
                    new String[]{"Gaming & Consoles", "PlayStation, Xbox, Nintendo Switch, VR headsets, and games"},
                    new String[]{"Bicycles & Mobility", "Commuter bicycles, electric scooters, helmets, and locks"},
                    new String[]{"Textbooks & Academic", "Coursebooks, graphing calculators, lab equipment"},
                    new String[]{"Fashion & Event Wear", "Formal suits, blazers, graduation gowns, cosplay"},
                    new String[]{"Tools & DIY", "3D printers, power drills, toolkits, camping gear"}
            );

            for (String[] catData : defaultCategories) {
                Category cat = new Category();
                cat.setName(catData[0]);
                cat.setDescription(catData[1]);
                categoryRepository.save(cat);
            }
        }

        // 2. Seed Users if empty
        User adminUser = userRepository.findByEmail("admin@rentloop.edu").orElse(null);
        User sarahOwner = userRepository.findByEmail("sarah.owner@university.edu").orElse(null);
        User alexRenter = userRepository.findByEmail("alex.renter@university.edu").orElse(null);

        if (userRepository.count() == 0) {
            adminUser = new User();
            adminUser.setName("Admin Officer");
            adminUser.setEmail("admin@rentloop.edu");
            adminUser.setPasswordHash(passwordEncoder.encode("admin123"));
            adminUser.setPhone("+1 555-0999");
            adminUser.setRole(Role.ADMIN);
            adminUser = userRepository.save(adminUser);

            sarahOwner = new User();
            sarahOwner.setName("Sarah Chen");
            sarahOwner.setEmail("sarah.owner@university.edu");
            sarahOwner.setPasswordHash(passwordEncoder.encode("password123"));
            sarahOwner.setPhone("+1 555-0143");
            sarahOwner.setRole(Role.USER);
            sarahOwner = userRepository.save(sarahOwner);

            alexRenter = new User();
            alexRenter.setName("Alex Rivera");
            alexRenter.setEmail("alex.renter@university.edu");
            alexRenter.setPasswordHash(passwordEncoder.encode("password123"));
            alexRenter.setPhone("+1 555-0192");
            alexRenter.setRole(Role.USER);
            alexRenter = userRepository.save(alexRenter);
        }

        // 3. Seed Sample Listings if empty
        if (listingRepository.count() == 0 && sarahOwner != null) {
            List<Category> allCats = categoryRepository.findAll();
            if (!allCats.isEmpty()) {
                Category techCat = allCats.get(0);
                Category cameraCat = allCats.size() > 1 ? allCats.get(1) : techCat;
                Category gamingCat = allCats.size() > 3 ? allCats.get(3) : techCat;

                // Listing 1: MacBook Pro
                Item item1 = new Item();
                item1.setOwner(sarahOwner);
                item1.setCategory(techCat);
                item1.setName("Apple MacBook Pro 16\" M3 Max");
                item1.setDescription("Pro workstation for ML training and 4K video rendering. Includes 140W fast charger.");
                item1.setCondition(ItemCondition.LIKE_NEW);

                ItemAttribute a1 = new ItemAttribute();
                a1.setAttributeKey("RAM");
                a1.setAttributeValue("36 GB Unified");
                item1.addAttribute(a1);

                ItemAttribute a2 = new ItemAttribute();
                a2.setAttributeKey("Storage");
                a2.setAttributeValue("1 TB SSD");
                item1.addAttribute(a2);

                item1 = itemRepository.save(item1);

                Listing listing1 = new Listing();
                listing1.setItem(item1);
                listing1.setTitle("MacBook Pro 16\" M3 Max — 36GB RAM / 1TB SSD");
                listing1.setPricePerDay(new BigDecimal("28.00"));
                listing1.setDepositAmount(new BigDecimal("150.00"));
                listing1.setLatitude(new BigDecimal("40.712800"));
                listing1.setLongitude(new BigDecimal("-74.006000"));
                listing1.setStatus(ListingStatus.ACTIVE);

                ListingImage img1 = new ListingImage();
                img1.setImageUrl("https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80");
                img1.setIsPrimary(true);
                listing1.addImage(img1);

                listingRepository.save(listing1);

                // Listing 2: Sony A7 IV Camera
                Item item2 = new Item();
                item2.setOwner(sarahOwner);
                item2.setCategory(cameraCat);
                item2.setName("Sony Alpha 7 IV Cinema Rig");
                item2.setDescription("4K 60fps full-frame camera with 24-70mm f/2.8 GM lens and 3 batteries.");
                item2.setCondition(ItemCondition.LIKE_NEW);

                ItemAttribute ca1 = new ItemAttribute();
                ca1.setAttributeKey("Resolution");
                ca1.setAttributeValue("33 MP Full Frame");
                item2.addAttribute(ca1);

                item2 = itemRepository.save(item2);

                Listing listing2 = new Listing();
                listing2.setItem(item2);
                listing2.setTitle("Sony A7 IV Full-Frame Camera + 24-70mm f/2.8 GM Lens");
                listing2.setPricePerDay(new BigDecimal("35.00"));
                listing2.setDepositAmount(new BigDecimal("200.00"));
                listing2.setLatitude(new BigDecimal("40.714000"));
                listing2.setLongitude(new BigDecimal("-74.005000"));
                listing2.setStatus(ListingStatus.ACTIVE);

                ListingImage img2 = new ListingImage();
                img2.setImageUrl("https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80");
                img2.setIsPrimary(true);
                listing2.addImage(img2);

                listingRepository.save(listing2);

                // Listing 3: PS5
                Item item3 = new Item();
                item3.setOwner(sarahOwner);
                item3.setCategory(gamingCat);
                item3.setName("Sony PS5 Disc Edition Bundle");
                item3.setDescription("Includes 2 DualSense wireless controllers and top games.");
                item3.setCondition(ItemCondition.LIKE_NEW);

                item3 = itemRepository.save(item3);

                Listing listing3 = new Listing();
                listing3.setItem(item3);
                listing3.setTitle("PlayStation 5 Disc Edition + 2 DualSense + 4 Games");
                listing3.setPricePerDay(new BigDecimal("18.00"));
                listing3.setDepositAmount(new BigDecimal("120.00"));
                listing3.setLatitude(new BigDecimal("40.715000"));
                listing3.setLongitude(new BigDecimal("-74.003000"));
                listing3.setStatus(ListingStatus.ACTIVE);

                ListingImage img3 = new ListingImage();
                img3.setImageUrl("https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=900&q=80");
                img3.setIsPrimary(true);
                listing3.addImage(img3);

                listingRepository.save(listing3);
            }
        }
    }
}
