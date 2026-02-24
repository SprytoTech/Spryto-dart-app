import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppColors {
  static const Color background = Color(0xFF0F1115);
  static const Color card = Color(0xFF151518);
  static const Color primary = Color(0xFFFF4757);
  static const Color neonPink = Color(0xFFF43F5E);
  static const Color neonViolet = Color(0xFF8B5CF6);
  static const Color secondary = Color(0xFF2F80ED);
  static const Color textMain = Colors.white;
  static const Color textSec = Color(0xFFA1A1AA);
  static const Color glassBorder = Color(0x14FFFFFF);
}

ThemeData getAppTheme() {
  return ThemeData(
    brightness: Brightness.dark,
    scaffoldBackgroundColor: AppColors.background,
    primaryColor: AppColors.primary,
    useMaterial3: true,
    textTheme: GoogleFonts.interTextTheme(ThemeData.dark().textTheme),
  );
}
